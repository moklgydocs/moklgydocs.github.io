# 采样方法

> 采样,是 AI 探索可能性空间的方式。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段,第 06–07 课(概率、贝叶斯定理)
**预计耗时:** 约 120 分钟

## 学习目标

- 只凭均匀随机数,从零实现逆 CDF、拒绝采样和重要度采样
- 构建用于语言模型 token 生成的温度采样、top-k 采样和 top-p(核)采样
- 解释重参数化技巧,以及它为什么能让 VAE 中的采样操作参与反向传播
- 运行 Metropolis-Hastings MCMC,从一个未归一化的目标分布中采样

## 问题

语言模型处理完你的提示词,输出一个 50,000 维的 logits 向量——词表里每个 token 对应一个。现在它得从中挑一个。怎么挑?

如果永远挑概率最高的 token,每次回答都一模一样:确定、乏味。如果完全随机均匀挑,输出就是胡言乱语。答案在这两个极端之间的某处,而那个"某处"由采样来控制。

采样远不止文本生成。强化学习靠采样轨迹来估计策略梯度;VAE 从学出的分布中采样,并穿过随机性做反向传播来学习潜在表示;扩散模型采样噪声再逐步去噪来生成图像;蒙特卡洛方法估计那些没有闭式解的积分;MCMC 算法探索无法枚举的高维后验分布。

每一个生成式 AI 系统都是采样系统。采样策略决定输出的质量、多样性和可控性。本课将从零构建所有主流采样方法——从均匀随机数出发,一直到驱动现代 LLM 和生成模型的技术。

## 概念

### 为什么采样重要

采样在 AI 与机器学习中扮演四种基本角色:

**生成。** 语言模型、扩散模型和 GAN 都通过采样产生输出。采样算法直接控制创造性、连贯性和多样性。温度、top-k、核采样,是工程师每天都在拧的旋钮。

**训练。** 随机梯度下降采样 mini-batch;Dropout 采样要停用的神经元;数据增强采样随机变换;重要度采样通过重加权样本来降低强化学习(PPO、TRPO)中的梯度方差。

**估计。** ML 中很多量没有闭式解:数据分布下的期望损失、能量模型的配分函数、贝叶斯推断中的证据。蒙特卡洛估计用样本平均来逼近所有这些量。

**探索。** MCMC 算法探索贝叶斯推断中的后验分布;进化策略采样参数扰动;Thompson 采样在老虎机问题中平衡探索与利用。

核心挑战在于:你只能直接从简单分布(均匀、正态)中采样。对其他一切分布,你需要一种方法,把简单样本转换成目标分布的样本。

### 均匀随机采样

一切采样方法都从这里开始。均匀随机数生成器产生 [0, 1) 区间内的值,任何等长的子区间都有相等的概率。

```
U ~ Uniform(0, 1)

P(a <= U <= b) = b - a    for 0 <= a <= b <= 1

Properties:
  E[U] = 0.5
  Var(U) = 1/12
```

要从 n 个离散项中均匀采样,生成 U 并返回 floor(n * U)。要从连续区间 [a, b] 采样,计算 a + (b - a) * U。

关键洞察:一个均匀随机数携带的随机性,恰好足以产生任何分布的一个样本。技巧在于找到正确的变换。

### 逆 CDF 法(逆变换采样)

累积分布函数(CDF)把值映射到概率:

```
F(x) = P(X <= x)

Properties:
  F is non-decreasing
  F(-inf) = 0
  F(+inf) = 1
  F maps the real line to [0, 1]
```

逆 CDF 把概率映射回值。若 U ~ Uniform(0, 1),则 X = F_inverse(U) 服从目标分布。

```
Algorithm:
  1. Generate u ~ Uniform(0, 1)
  2. Return F_inverse(u)

Why it works:
  P(X <= x) = P(F_inverse(U) <= x) = P(U <= F(x)) = F(x)
```

**指数分布示例:**

```
PDF: f(x) = lambda * exp(-lambda * x),   x >= 0
CDF: F(x) = 1 - exp(-lambda * x)

Solve F(x) = u for x:
  u = 1 - exp(-lambda * x)
  exp(-lambda * x) = 1 - u
  x = -ln(1 - u) / lambda

Since (1 - U) and U have the same distribution:
  x = -ln(u) / lambda
```

当你能写出 F_inverse 的闭式表达时,这个方法堪称完美。正态分布没有闭式的逆 CDF,所以得用别的方法(Box-Muller,或数值近似)。

**离散版本:** 对离散分布,用累加和构建 CDF,生成 U,找到累加和首次超过 U 的下标。这就是第 06 课里 `sample_categorical` 的工作原理。

### 拒绝采样

当 CDF 无法求逆、但目标 PDF 可以(在相差一个常数的意义下)求值时,拒绝采样就派上用场。

```
Target distribution: p(x)  (can evaluate, possibly unnormalized)
Proposal distribution: q(x)  (can sample from)
Bound: M such that p(x) <= M * q(x) for all x

Algorithm:
  1. Sample x ~ q(x)
  2. Sample u ~ Uniform(0, 1)
  3. If u < p(x) / (M * q(x)), accept x
  4. Otherwise, reject and go to step 1

Acceptance rate = 1/M
```

界 M 越紧,接受率越高。低维(1–3 维)时拒绝采样表现不错;高维时接受率指数级下降,因为提议的体积大部分都被拒绝了。这就是拒绝采样的维度灾难。

**示例:从截断正态分布采样。** 在截断区间上用均匀提议,包络 M 取该区间内正态 PDF 的最大值。

**示例:从半圆内采样。** 在外接矩形内均匀提议,点落在半圆内则接受。蒙特卡洛算 π 就是这个原理:接受率等于面积比 π/4。

### 重要度采样

有时你需要的不是目标分布 p(x) 的样本,而是 p(x) 下某个期望的估计——而你手上只有另一个分布 q(x) 的样本。

```
Goal: estimate E_p[f(x)] = integral of f(x) * p(x) dx

Rewrite:
  E_p[f(x)] = integral of f(x) * (p(x)/q(x)) * q(x) dx
            = E_q[f(x) * w(x)]

where w(x) = p(x) / q(x)  are the importance weights.

Estimator:
  E_p[f(x)] ~ (1/N) * sum(f(x_i) * w(x_i))    where x_i ~ q(x)
```

这在强化学习中至关重要。PPO(近端策略优化)里,轨迹是在旧策略 pi_old 下采集的,但要优化的是新策略 pi_new,重要度权重就是 pi_new(a|s) / pi_old(a|s)。PPO 裁剪这些权重,防止新策略偏离旧策略太远。

重要度采样估计量的方差取决于 q 与 p 的相似程度。q 与 p 差得越远,少数样本就会拿到巨大权重并主导估计。自归一化重要度采样通过除以权重之和来缓解这个问题:

```
E_p[f(x)] ~ sum(w_i * f(x_i)) / sum(w_i)
```

### 蒙特卡洛估计

蒙特卡洛估计用随机样本的平均来逼近积分。大数定律保证其收敛。

```
Goal: estimate I = integral of g(x) dx over domain D

Method:
  1. Sample x_1, ..., x_N uniformly from D
  2. I ~ (Volume of D / N) * sum(g(x_i))

Error: O(1 / sqrt(N))   regardless of dimension
```

误差率与维度无关。这就是为什么在网格积分束手无策的高维问题上,蒙特卡洛一家独大。

**估计 π:**

```
Sample (x, y) uniformly from [-1, 1] x [-1, 1]
Count how many fall inside the unit circle: x^2 + y^2 <= 1
pi ~ 4 * (count inside) / (total count)
```

**估计期望:**

```
E[f(X)] ~ (1/N) * sum(f(x_i))    where x_i ~ p(x)

The sample mean converges to the true expectation.
Variance of the estimator = Var(f(X)) / N
```

### 马尔可夫链蒙特卡洛(MCMC):Metropolis-Hastings

MCMC 构造一条马尔可夫链,使其平稳分布就是目标分布 p(x)。走够多步之后,链上的样本就近似是 p(x) 的样本。

```
Target: p(x)  (known up to a normalizing constant)
Proposal: q(x'|x)  (how to propose the next state given the current state)

Metropolis-Hastings algorithm:
  1. Start at some x_0
  2. For t = 1, 2, ..., T:
     a. Propose x' ~ q(x'|x_t)
     b. Compute acceptance ratio:
        alpha = [p(x') * q(x_t|x')] / [p(x_t) * q(x'|x_t)]
     c. Accept with probability min(1, alpha):
        - If u < alpha (u ~ Uniform(0,1)): x_{t+1} = x'
        - Otherwise: x_{t+1} = x_t
  3. Discard first B samples (burn-in)
  4. Return remaining samples
```

对于对称提议(q(x'|x) = q(x|x')),比率简化为 p(x')/p(x)。这就是原始的 Metropolis 算法。

**为什么有效。** 接受规则保证了细致平衡:处于 x 并移动到 x' 的概率,等于处于 x' 并移动到 x 的概率。细致平衡意味着 p(x) 就是这条链的平稳分布。

**实践要点:**

- Burn-in(预烧):链达到平衡前的早期样本要丢弃
- 稀释(thinning):每 k 个样本保留一个,降低自相关
- 提议尺度:太小,链挪动缓慢(接受率高但探索慢);太大,多数提议被拒(接受率低,原地踏步)
- 高维高斯提议的最优接受率约为 0.234

### Gibbs 采样

Gibbs 采样是 MCMC 在多元分布上的特例。它不在所有维度上同时提议移动,而是一次只更新一个变量——从它的条件分布中采样。

```
Target: p(x_1, x_2, ..., x_d)

Algorithm:
  For each iteration t:
    Sample x_1^{t+1} ~ p(x_1 | x_2^t, x_3^t, ..., x_d^t)
    Sample x_2^{t+1} ~ p(x_2 | x_1^{t+1}, x_3^t, ..., x_d^t)
    ...
    Sample x_d^{t+1} ~ p(x_d | x_1^{t+1}, x_2^{t+1}, ..., x_{d-1}^{t+1})
```

Gibbs 采样要求你能从每个条件分布 p(x_i | x_{-i}) 中采样。对很多模型这都很直接:

- 贝叶斯网络:条件分布由图结构直接给出
- 高斯混合:条件分布是高斯
- Ising 模型:每个自旋的条件分布只依赖它的邻居

接受率恒为 1(每个提议都被接受),因为从精确条件分布采样天然满足细致平衡。

**局限。** 变量高度相关时,Gibbs 采样混合很慢——一次只更新一个变量,无法沿分布的对角方向做大步移动。

### 温度采样(LLM 中使用)

语言模型为词表中每个 token 输出 logits z_1, ..., z_V,softmax 把它们转成概率。温度在 softmax 之前对 logits 做缩放:

```
p_i = exp(z_i / T) / sum(exp(z_j / T))

T = 1.0: standard softmax (original distribution)
T -> 0:  argmax (deterministic, always picks highest logit)
T -> inf: uniform (all tokens equally likely)
T < 1.0: sharpens the distribution (more confident, less diverse)
T > 1.0: flattens the distribution (less confident, more diverse)
```

**为什么有效。** 用 T < 1 去除 logits,会放大 logit 之间的差距。若 z_1 = 2、z_2 = 1,除以 T = 0.5 后得到 z_1/T = 4、z_2/T = 2,差距翻倍。经过 softmax,最高 logit 的 token 会分到更大的概率份额。

**实践中:**

- T = 0.0:贪心解码,最适合事实性问答
- T = 0.3–0.7:略带创造,适合代码生成
- T = 0.7–1.0:均衡,适合一般对话
- T = 1.0–1.5:创意写作、头脑风暴
- T > 1.5:越来越随机,基本没用

温度不改变哪些 token 可能被选中,只改变分配给每个 token 的概率质量。

### Top-k 采样

Top-k 采样把候选集限制在概率最高的 k 个 token 内,然后重新归一化并从中采样。

```
Algorithm:
  1. Compute softmax probabilities for all V tokens
  2. Sort tokens by probability (descending)
  3. Keep only the top k tokens
  4. Renormalize: p_i' = p_i / sum(p_j for j in top-k)
  5. Sample from the renormalized distribution

k = 1:  greedy decoding
k = V:  no filtering (standard sampling)
k = 40: typical setting, removes long tail of unlikely tokens
```

Top-k 防止模型选中那些藏在词表分布长尾里的极不可能 token(错别字、胡话)。问题在于 k 是固定的,不随上下文变化:模型很确定时(某个 token 占了 95% 概率),k = 40 仍放进 39 个备胎;模型不确定时(概率摊在 1000 个 token 上),k = 40 又会砍掉合理的选项。

### Top-p(核)采样

Top-p 采样动态调整候选集大小。它不固定保留多少个 token,而是保留累积概率刚好超过 p 的最小 token 集合。

```
Algorithm:
  1. Compute softmax probabilities for all V tokens
  2. Sort tokens by probability (descending)
  3. Find smallest k such that sum of top-k probabilities >= p
  4. Keep only those k tokens
  5. Renormalize and sample

p = 0.9:  keeps tokens covering 90% of probability mass
p = 1.0:  no filtering
p = 0.1:  very restrictive, nearly greedy
```

模型确定时,核采样只保留少数 token(也许 2–3 个);模型不确定时,保留很多(也许 200 个)。正是这种自适应行为,让核采样生成的文本通常优于 top-k。

**常见组合:**

- 温度 0.7 + top-p 0.9:通用好配置
- 温度 0.0(贪心):最适合确定性任务
- 温度 1.0 + top-k 50:Fan et al. (2018) 原论文配置

Top-k 和 top-p 可以组合:先做 top-k,再在剩余集合上做 top-p。

### 重参数化技巧(VAE 中使用)

变分自编码器(VAE)的学习方式是:把输入编码成潜在空间中的一个分布,从该分布采样,再把样本解码回去。问题在于:采样操作无法反向传播。

```
Standard sampling (not differentiable):
  z ~ N(mu, sigma^2)

  The randomness blocks gradient flow.
  d/d_mu [sample from N(mu, sigma^2)] = ???
```

重参数化技巧把随机性与参数分离开:

```
Reparameterized sampling:
  epsilon ~ N(0, 1)          (fixed random noise, no parameters)
  z = mu + sigma * epsilon   (deterministic function of parameters)

  Now z is a deterministic, differentiable function of mu and sigma.
  d(z)/d(mu) = 1
  d(z)/d(sigma) = epsilon

  Gradients flow through mu and sigma.
```

之所以可行,是因为 N(mu, sigma^2) 与 mu + sigma * N(0, 1) 同分布。关键洞察:把随机性挪到一个无参数的源头(epsilon),再把样本表达成参数的可微变换。

**在 VAE 训练循环里:**

1. 编码器为每个输入输出 mu 和 log(sigma^2)
2. 采样 epsilon ~ N(0, 1)
3. 计算 z = mu + sigma * epsilon
4. 解码 z,重建输入
5. 沿第 4、3、2、1 步反向传播(可行,因为第 3 步可微)

没有重参数化技巧,VAE 就无法用标准反向传播训练。正是这一个洞察,让 VAE 走向实用。

### Gumbel-Softmax(可微的类别采样)

重参数化技巧适用于连续分布(高斯)。离散的类别分布需要另一套办法:Gumbel-Softmax 提供了类别采样的可微近似。

**Gumbel-Max 技巧(不可微):**

```
To sample from a categorical distribution with log-probabilities log(p_1), ..., log(p_k):
  1. Sample g_i ~ Gumbel(0, 1) for each category
     (g = -log(-log(u)), where u ~ Uniform(0, 1))
  2. Return argmax(log(p_i) + g_i)

This produces exact categorical samples.
```

**Gumbel-Softmax(可微近似):**

```
Replace the hard argmax with a soft softmax:
  y_i = exp((log(p_i) + g_i) / tau) / sum(exp((log(p_j) + g_j) / tau))

tau (temperature) controls the approximation:
  tau -> 0:  approaches a one-hot vector (hard categorical)
  tau -> inf: approaches uniform (1/k, 1/k, ..., 1/k)
  tau = 1.0: soft approximation
```

Gumbel-Softmax 产出离散样本的连续松弛:输出是概率向量(软 one-hot)而不是硬 one-hot,梯度可以穿过 softmax 流动。训练时的前向传播可以用"直通"(straight-through)估计器:前向用硬 argmax,反向用软的 Gumbel-Softmax 梯度。

**应用:**

- VAE 中的离散潜在变量
- 神经架构搜索(选择离散操作)
- 硬注意力机制
- 离散动作的强化学习

### 分层采样

标准蒙特卡洛采样可能碰巧在样本空间里留下空洞。分层采样把空间划分成若干层(strata),从每层各采一个,强制均匀覆盖。

```
Standard Monte Carlo:
  Sample N points uniformly from [0, 1]
  Some regions may have clusters, others gaps

Stratified sampling:
  Divide [0, 1] into N equal strata: [0, 1/N), [1/N, 2/N), ..., [(N-1)/N, 1)
  Sample one point uniformly within each stratum
  x_i = (i + u_i) / N   where u_i ~ Uniform(0, 1),  i = 0, ..., N-1
```

分层采样的方差总是小于或等于标准蒙特卡洛:

```
Var(stratified) <= Var(standard Monte Carlo)

The improvement is largest when f(x) varies smoothly.
For piecewise-constant functions, stratified sampling is exact.
```

**应用:**

- 数值积分(拟蒙特卡洛)
- 训练数据划分(保证每折类别均衡)
- 带分层的重要度采样(两种技术结合)
- NeRF(神经辐射场)沿相机光线做分层采样

### 与扩散模型的联系

扩散模型通过一个采样过程生成图像。前向过程在 T 步内不断给图像加高斯噪声,直到变成纯噪声;反向过程学习去噪,一步步恢复出原图。

```
Forward process (known):
  x_t = sqrt(alpha_t) * x_{t-1} + sqrt(1 - alpha_t) * epsilon
  where epsilon ~ N(0, I)

  After T steps: x_T ~ N(0, I)  (pure noise)

Reverse process (learned):
  x_{t-1} = (1/sqrt(alpha_t)) * (x_t - (1 - alpha_t)/sqrt(1 - alpha_bar_t) * epsilon_theta(x_t, t)) + sigma_t * z
  where z ~ N(0, I)

  Each denoising step is a sampling step.
```

与本课方法的联系:

- 每个去噪步都用到重参数化技巧(采样噪声,再施加确定性变换)
- 噪声调度 {alpha_t} 相当于一种温度退火
- 训练用蒙特卡洛估计来逼近 ELBO(证据下界)
- 扩散模型中的祖先采样(ancestral sampling)是一条马尔可夫链(每步只依赖当前状态)

整个图像生成过程就是迭代采样:从噪声出发,每一步都以学到的去噪模型为条件,采出一个噪声稍少的版本。

```figure
monte-carlo-pi
```

## 动手构建

### 第 1 步:均匀采样与逆 CDF 采样

```python
import math
import random

def sample_uniform(a, b):
    return a + (b - a) * random.random()

def sample_exponential_inverse_cdf(lam):
    u = random.random()
    return -math.log(u) / lam
```

生成 10,000 个指数分布样本,验证均值是 1/lambda。

### 第 2 步:拒绝采样

```python
def rejection_sample(target_pdf, proposal_sample, proposal_pdf, M):
    while True:
        x = proposal_sample()
        u = random.random()
        if u < target_pdf(x) / (M * proposal_pdf(x)):
            return x
```

用拒绝采样从截断正态分布中抽样,画出样本直方图验证形状。

### 第 3 步:重要度采样

```python
def importance_sampling_estimate(f, target_pdf, proposal_pdf, proposal_sample, n):
    total = 0
    for _ in range(n):
        x = proposal_sample()
        w = target_pdf(x) / proposal_pdf(x)
        total += f(x) * w
    return total / n
```

用均匀提议估计正态分布下的 E[X^2],与已知答案(mu^2 + sigma^2)对比。

### 第 4 步:蒙特卡洛估计 π

```python
def monte_carlo_pi(n):
    inside = 0
    for _ in range(n):
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        if x*x + y*y <= 1:
            inside += 1
    return 4 * inside / n
```

### 第 5 步:Metropolis-Hastings MCMC

```python
def metropolis_hastings(target_log_pdf, proposal_sample, proposal_log_pdf, x0, n_samples, burn_in):
    samples = []
    x = x0
    for i in range(n_samples + burn_in):
        x_new = proposal_sample(x)
        log_alpha = (target_log_pdf(x_new) + proposal_log_pdf(x, x_new)
                     - target_log_pdf(x) - proposal_log_pdf(x_new, x))
        if math.log(random.random()) < log_alpha:
            x = x_new
        if i >= burn_in:
            samples.append(x)
    return samples
```

从一个双峰分布(两个高斯的混合)中采样,画出链的轨迹。

### 第 6 步:Gibbs 采样

```python
def gibbs_sampling_2d(conditional_x_given_y, conditional_y_given_x, x0, y0, n_samples, burn_in):
    x, y = x0, y0
    samples = []
    for i in range(n_samples + burn_in):
        x = conditional_x_given_y(y)
        y = conditional_y_given_x(x)
        if i >= burn_in:
            samples.append((x, y))
    return samples
```

### 第 7 步:温度采样

```python
def softmax(logits):
    max_l = max(logits)
    exps = [math.exp(z - max_l) for z in logits]
    total = sum(exps)
    return [e / total for e in exps]

def temperature_sample(logits, temperature):
    scaled = [z / temperature for z in logits]
    probs = softmax(scaled)
    return sample_from_probs(probs)
```

展示温度如何改变一组 token logits 的输出分布。

### 第 8 步:top-k 与 top-p 采样

```python
def top_k_sample(logits, k):
    indexed = sorted(enumerate(logits), key=lambda x: -x[1])
    top = indexed[:k]
    top_logits = [l for _, l in top]
    probs = softmax(top_logits)
    idx = sample_from_probs(probs)
    return top[idx][0]

def top_p_sample(logits, p):
    probs = softmax(logits)
    indexed = sorted(enumerate(probs), key=lambda x: -x[1])
    cumsum = 0
    selected = []
    for token_idx, prob in indexed:
        cumsum += prob
        selected.append((token_idx, prob))
        if cumsum >= p:
            break
    sel_probs = [pr for _, pr in selected]
    total = sum(sel_probs)
    sel_probs = [pr / total for pr in sel_probs]
    idx = sample_from_probs(sel_probs)
    return selected[idx][0]
```

### 第 9 步:重参数化技巧

```python
def reparam_sample(mu, sigma):
    epsilon = random.gauss(0, 1)
    return mu + sigma * epsilon

def reparam_gradient(mu, sigma, epsilon):
    dz_dmu = 1.0
    dz_dsigma = epsilon
    return dz_dmu, dz_dsigma
```

演示梯度能穿过重参数化的样本流动,却穿不过直接采样。

### 第 10 步:Gumbel-Softmax

```python
def gumbel_sample():
    u = random.random()
    return -math.log(-math.log(u))

def gumbel_softmax(logits, temperature):
    gumbels = [math.log(p) + gumbel_sample() for p in logits]
    return softmax([g / temperature for g in gumbels])
```

展示降低温度如何让输出逼近 one-hot 向量。

含全部可视化的完整实现见 `code/sampling.py`。

## 投入使用

用 NumPy 和 SciPy 的生产级写法:

```python
import numpy as np

rng = np.random.default_rng(42)

exponential_samples = rng.exponential(scale=2.0, size=10000)
print(f"Exponential mean: {exponential_samples.mean():.4f} (expected 2.0)")

from scipy import stats
normal = stats.norm(loc=0, scale=1)
print(f"CDF at 1.96: {normal.cdf(1.96):.4f}")
print(f"Inverse CDF at 0.975: {normal.ppf(0.975):.4f}")

logits = np.array([2.0, 1.0, 0.5, 0.1, -1.0])
temperature = 0.7
scaled = logits / temperature
probs = np.exp(scaled - scaled.max()) / np.exp(scaled - scaled.max()).sum()
token = rng.choice(len(logits), p=probs)
print(f"Sampled token index: {token}")
```

大规模 MCMC 用专门的库:

- PyMC:完整的贝叶斯建模,含 NUTS(自适应 HMC)
- emcee:集成 MCMC 采样器
- NumPyro/JAX:GPU 加速的 MCMC

这些方法你已经从零实现过了。现在你知道库调用背后在做什么。

## 练习

1. 为柯西分布实现逆 CDF 采样。CDF 为 F(x) = 0.5 + arctan(x)/pi。生成 10,000 个样本,画直方图与真实 PDF 对比。注意观察重尾(远离中心的极端值)。

2. 用拒绝采样从 Beta(2, 5) 分布生成样本,提议分布用 Uniform(0, 1)。把接受的样本与真实 Beta PDF 画在一起。理论接受率是多少?

3. 用蒙特卡洛估计 sin(x) 在 0 到 π 上的积分,分别用 1,000、10,000、100,000 个样本。比较各档误差,验证误差按 O(1/sqrt(N)) 缩放。

4. 实现 Metropolis-Hastings,从二维分布 p(x, y) ∝ exp(-(x^2 * y^2 + x^2 + y^2 - 8*x - 8*y) / 2) 中采样。画出样本和链轨迹。尝试不同的提议标准差。

5. 构建一个完整的文本生成演示:给定 10 个词的词表及其 logits,分别用 (a) 贪心、(b) 温度=0.7、(c) top-k=3、(d) top-p=0.9 生成 20 个 token 的序列。各跑 5 次,比较输出的多样性。

## 关键术语

| 术语 | 人们常说的是 | 实际含义是 |
|------|----------------|----------------------|
| 采样 | "抽随机数" | 按某个概率分布生成值。一切生成式 AI 背后的机制 |
| 均匀分布 | "全都等可能" | [a, b] 内每个值的概率密度都是 1/(b-a)。所有采样方法的起点 |
| 逆 CDF | "概率变换" | F_inverse(U) 把均匀样本变成任何已知 CDF 分布的样本。精确且高效 |
| 拒绝采样 | "提议再接受/拒绝" | 从简单提议分布生成,按目标/提议比率决定接受概率。精确但浪费样本 |
| 重要度采样 | "给样本重加权" | 用 q(x) 的样本估计 p(x) 下的期望,每个样本加权 p(x)/q(x)。RL 中 PPO 的核心 |
| 蒙特卡洛 | "随机样本取平均" | 用样本平均逼近积分。误差 O(1/sqrt(N)),与维度无关 |
| MCMC | "会收敛的随机游走" | 构造一条马尔可夫链,使其平稳分布就是目标分布。Metropolis-Hastings 是奠基算法 |
| Metropolis-Hastings | "上坡总接受,下坡偶尔接受" | 提议移动,按密度比接受。细致平衡保证收敛到目标分布 |
| Gibbs 采样 | "一次一个变量" | 固定其余变量,从每个变量的条件分布更新。接受率 100% |
| 温度 | "置信度旋钮" | softmax 前把 logits 除以 T。T<1 变锐(更自信),T>1 变平(更多样) |
| Top-k 采样 | "只留最好的 k 个" | 把概率最高的 k 个 token 之外的全部清零,重新归一化再采样。候选集大小固定 |
| 核采样(top-p) | "只留靠谱的那些" | 保留累积概率刚好超过 p 的最小 token 集合。候选集大小自适应 |
| 重参数化技巧 | "把随机性挪出去" | 写成 z = mu + sigma * epsilon,其中 epsilon ~ N(0,1)。让采样可微。VAE 训练的关键 |
| Gumbel-Softmax | "软化的类别采样" | 用 Gumbel 噪声加带温度的 softmax,对类别采样做可微近似 |
| 分层采样 | "强制覆盖" | 把样本空间分层,从每层采样。方差总是不高于朴素蒙特卡洛 |
| Burn-in | "预热期" | MCMC 链达到平稳分布之前要丢弃的初始样本 |
| 细致平衡 | "可逆性条件" | p(x) * T(x->y) = p(y) * T(y->x)。p 成为马尔可夫链平稳分布的充分条件 |
| 扩散采样 | "迭代去噪" | 从噪声出发,逐步施加学到的去噪操作来生成数据。每一步都是一次条件采样 |

## 延伸阅读

- [Holbrook (2023): The Metropolis-Hastings Algorithm](https://arxiv.org/abs/2304.07010) — MCMC 基础的详细教程
- [Jang, Gu, Poole (2017): Categorical Reparameterization with Gumbel-Softmax](https://arxiv.org/abs/1611.01144) — Gumbel-Softmax 原始论文
- [Holtzman et al. (2020): The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751) — 核(top-p)采样论文
- [Kingma & Welling (2014): Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114) — 提出重参数化技巧的 VAE 论文
- [Ho, Jain, Abbeel (2020): Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) — DDPM,把采样与图像生成联系起来
