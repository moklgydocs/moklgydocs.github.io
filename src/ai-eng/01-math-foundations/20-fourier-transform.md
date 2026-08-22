# 傅里叶变换

> 任何信号都是正弦波之和。傅里叶变换告诉你是哪些。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 1 阶段,第 01–04 课、第 19 课(复数)
**预计耗时:** 约 90 分钟

## 学习目标

- 从零实现 DFT,并与 O(N log N) 的 Cooley-Tukey FFT 互相验证
- 解读频率系数:从信号中提取幅度、相位和功率谱
- 应用卷积定理,用 FFT 乘法实现卷积
- 把傅里叶频率分解与 Transformer 位置编码、CNN 卷积层联系起来

## 问题

一段录音是随时间变化的气压测量序列;一只股票的价格是随日期变化的数值序列;一张图像是像素强度在空间上的网格。这些都是时域(或空域)数据:你看到数值随某个索引变化。

但很多模式在时域里是看不见的。这段音频是纯音还是和弦?这只股票有没有以周为单位的周期?这张图像有没有重复的纹理?这些问题问的都是频率成分,而时域把它藏了起来。

傅里叶变换把数据从时域转换到频域:它把信号分解成不同频率的正弦波。每个正弦波有幅度(有多强)和相位(从哪里开始),傅里叶变换把两者都告诉你。

这对机器学习很重要,因为频域思维无处不在:卷积神经网络做的是卷积,而卷积在频域里就是乘法;Transformer 的位置编码用频率分解来表示位置;音频模型(语音识别、音乐生成)在声谱图(spectrogram,声音的频域表示)上工作;时间序列模型寻找周期模式。理解傅里叶变换,你就有了与这一切打交道的词汇。

## 概念

### DFT 的定义

给定 N 个样本 x[0], x[1], ..., x[N-1],离散傅里叶变换(DFT)产生 N 个频率系数 X[0], X[1], ..., X[N-1]:

```
X[k] = sum_{n=0}^{N-1} x[n] * e^(-2*pi*i*k*n/N)

for k = 0, 1, ..., N-1
```

每个 X[k] 都是一个复数:它的模长 |X[k]| 告诉你频率 k 的幅度,它的相角 angle(X[k]) 告诉你该频率的相位偏移。

关键洞见:`e^(-2*pi*i*k*n/N)` 是一个以频率 k 旋转的相量。DFT 计算的是信号与 N 个等间隔频率中每一个的相关程度。信号若在频率 k 上含有能量,相关值就大;否则就接近零。

### 每个系数的含义

**X[0]:直流分量。** 它是所有样本之和,与均值成正比,代表信号的恒定(零频率)偏移。

```
X[0] = sum_{n=0}^{N-1} x[n] * e^0 = sum of all samples
```

**X[k](1 <= k <= N/2):正频率。** X[k] 代表每 N 个样本内振荡 k 个周期的频率。k 越大,频率越高(振荡越快)。

**X[N/2]:奈奎斯特频率。** 用 N 个样本能表示的最高频率。超过它就会出现混叠(aliasing)——高频伪装成低频。

**X[k](N/2 < k < N):负频率。** 对实值信号,X[N-k] = conj(X[k]):负频率是正频率的镜像。这就是为什么有用信息全在前 N/2 + 1 个系数里。

### 逆 DFT

逆 DFT 从频率系数重建原始信号:

```
x[n] = (1/N) * sum_{k=0}^{N-1} X[k] * e^(2*pi*i*k*n/N)

for n = 0, 1, ..., N-1
```

与正向 DFT 的差别只有两处:指数符号为正(而非负),并多一个 1/N 的归一化因子。

逆 DFT 是完美重建,不丢失任何信息。你可以从时域到频域再原路返回,毫无误差。DFT 本质上是换基——把同一份信息用另一套坐标系重新表达。

### FFT:让它快起来

按上面定义的 DFT 是 O(N^2):N 个输出系数,每个都要对 N 个输入样本求和。N = 100 万时,就是 10^12 次运算。

快速傅里叶变换(FFT)用 O(N log N) 算出完全相同的结果。N = 100 万时,只需约 2000 万次运算,而不是一万亿次。正是它让频率分析变得实用。

Cooley-Tukey 算法(最常见的 FFT)用的是分治:

1. 把信号按偶数下标和奇数下标拆成两半。
2. 递归地对每一半分别计算 DFT。
3. 用"旋转因子"(twiddle factor)e^(-2*pi*i*k/N) 把两个半尺寸的 DFT 合并起来。

```
X[k] = E[k] + e^(-2*pi*i*k/N) * O[k]          for k = 0, ..., N/2 - 1
X[k + N/2] = E[k] - e^(-2*pi*i*k/N) * O[k]    for k = 0, ..., N/2 - 1

where E = DFT of even-indexed samples
      O = DFT of odd-indexed samples
```

由于对称性,每层递归只做 O(N) 的工作,而一共有 log2(N) 层。总复杂度:O(N log N)。

```mermaid
graph TD
    subgraph "8-point FFT (Cooley-Tukey)"
        X["x[0..7]<br/>8 samples"] -->|"split even/odd"| E["Even: x[0,2,4,6]"]
        X -->|"split even/odd"| O["Odd: x[1,3,5,7]"]
        E -->|"4-pt FFT"| EK["E[0..3]"]
        O -->|"4-pt FFT"| OK["O[0..3]"]
        EK -->|"combine with twiddle factors"| XK["X[0..7]"]
        OK -->|"combine with twiddle factors"| XK
    end
    subgraph "Complexity"
        C1["DFT: O(N^2) = 64 multiplications"]
        C2["FFT: O(N log N) = 24 multiplications"]
    end
```

FFT 要求信号长度是 2 的幂。实践中,信号会补零到下一个 2 的幂。

### 频谱分析

**功率谱**是 |X[k]|^2——每个频率系数的模长平方,展示每个频率上有多少能量。

**相位谱**是 angle(X[k])——每个频率的相位偏移。大多数分析任务只关心功率谱,忽略相位。

```
Power at frequency k:  P[k] = |X[k]|^2 = X[k].real^2 + X[k].imag^2
Phase at frequency k:  phi[k] = atan2(X[k].imag, X[k].real)
```

### 频率分辨率

DFT 的频率分辨率取决于样本数 N 和采样率 fs。

```
Frequency of bin k:      f_k = k * fs / N
Frequency resolution:    delta_f = fs / N
Maximum frequency:       f_max = fs / 2  (Nyquist)
```

想区分两个靠得很近的频率,你需要更多样本;想捕获更高的频率,你需要更高的采样率。

### 卷积定理

这是信号处理里最重要的结论之一,与 CNN 直接相关。

**时域中的卷积,等于频域中的逐点相乘。**

```
x * h = IFFT(FFT(x) . FFT(h))

where * is convolution and . is element-wise multiplication
```

它为什么重要:

- 对长度分别为 N 和 M 的两个信号直接做卷积,需要 O(N*M) 次运算。
- 基于 FFT 的卷积只要 O(N log N):变换两者、相乘、逆变换回来。
- 对大卷积核,FFT 卷积快得多。
- 这正是在大感受野卷积层里发生的事情。

注意:DFT 计算的是循环卷积(信号首尾相接)。要做线性卷积(不环绕),先把两个信号都补零到长度 N + M - 1 再计算。

```mermaid
graph LR
    subgraph "Time Domain"
        TA["Signal x[n]"] -->|"convolve (slow: O(NM))"| TC["Output y[n]"]
        TB["Filter h[n]"] -->|"convolve"| TC
    end
    subgraph "Frequency Domain"
        FA["FFT(x)"] -->|"multiply (fast: O(N))"| FC["FFT(x) * FFT(h)"]
        FB["FFT(h)"] -->|"multiply"| FC
        FC -->|"IFFT"| FD["y[n]"]
    end
    TA -.->|"FFT"| FA
    TB -.->|"FFT"| FB
    FD -.->|"same result"| TC
```

### 加窗

DFT 假设信号是周期的——它把这 N 个样本当作一个无限重复信号的一个周期。如果信号首尾取值不同,边界处就会出现间断,表现为虚假的高频成分,这叫频谱泄漏(spectral leakage)。

加窗的做法是:在计算 DFT 之前,把信号两端逐渐收窄到零,从而减少泄漏。

常用窗函数:

| 窗 | 形状 | 主瓣宽度 | 旁瓣电平 | 适用场景 |
|--------|-------|----------------|-----------------|----------|
| 矩形窗 | 平直(不加窗) | 最窄 | 最高(-13 dB) | 信号在 N 个样本内恰好整周期时 |
| Hann 窗 | 升余弦 | 中等 | 低(-31 dB) | 通用频谱分析 |
| Hamming 窗 | 修正余弦 | 中等 | 更低(-42 dB) | 音频处理、语音分析 |
| Blackman 窗 | 三项余弦 | 宽 | 很低(-58 dB) | 旁瓣抑制至关重要的场合 |

```
Hann window:    w[n] = 0.5 * (1 - cos(2*pi*n / (N-1)))
Hamming window: w[n] = 0.54 - 0.46 * cos(2*pi*n / (N-1))
```

加窗方式:在 DFT 之前把窗与信号逐点相乘,即 `X = DFT(x * w)`。

### DFT 的性质

| 性质 | 时域 | 频域 |
|----------|-------------|-----------------|
| 线性 | a*x + b*y | a*X + b*Y |
| 时移 | x[n - k] | X[f] * e^(-2*pi*i*f*k/N) |
| 频移 | x[n] * e^(2*pi*i*f0*n/N) | X[f - f0] |
| 卷积 | x * h | X * H(逐点) |
| 乘积 | x * h(逐点) | X * H(循环卷积,缩放 1/N) |
| 帕塞瓦尔定理 | sum \|x[n]\|^2 | (1/N) * sum \|X[k]\|^2 |
| 共轭对称(实数输入) | x[n] 为实数 | X[k] = conj(X[N-k]) |

帕塞瓦尔定理说的是:两个域里的总能量相等——能量在变换前后守恒。

### 与位置编码的联系

原始 Transformer 使用正弦位置编码:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

每一对维度 (2i, 2i+1) 以不同频率振荡。频率从最高(第 0、1 维)到最低(最后几维)按几何级数排开。这让每个位置在所有频带上都有独一无二的模式——正如傅里叶系数可以唯一标识一个信号。

它提供的关键性质:

- **唯一性:** 没有两个位置拥有相同的编码。
- **取值有界:** sin 和 cos 永远在 [-1, 1] 之内。
- **相对位置:** 位置 p+k 的编码可以表示为位置 p 编码的线性函数,因此模型可以学会关注相对位置。

### 与 CNN 的联系

卷积层把一个学出来的滤波器(卷积核)滑过信号或图像,作用到输入上。从数学上看,这就是卷积运算。

根据卷积定理,它等价于:
1. 对输入做 FFT
2. 对卷积核做 FFT
3. 在频域相乘
4. 对结果做 IFFT

标准 CNN 实现用的是直接卷积(对 3x3 小核更快)。但对大卷积核或全局卷积,基于 FFT 的方法显著更快。有些架构(如 FNet)干脆用 FFT 完全替换注意力,以 O(N log N) 而非 O(N^2) 的复杂度取得了有竞争力的准确率。

### 声谱图与短时傅里叶变换

单次 FFT 给出的是整个信号的频率成分,却完全不告诉你这些频率出现在什么时间。一个啁啾信号(频率随时间升高)和一个和弦(所有频率同时出现)可能有完全相同的幅度谱。

短时傅里叶变换(STFT)解决了这个问题:在信号的重叠滑动窗上分别计算 FFT。结果就是声谱图——一个横轴为时间、纵轴为频率的二维表示,每个点的亮度代表该时间、该频率处的能量。

```
STFT procedure:
1. Choose a window size (e.g., 1024 samples)
2. Choose a hop size (e.g., 256 samples -- 75% overlap)
3. For each window position:
   a. Extract the windowed segment
   b. Apply a Hann/Hamming window
   c. Compute FFT
   d. Store the magnitude spectrum as one column of the spectrogram
```

声谱图是音频机器学习模型的标准输入表示。语音识别模型(Whisper、DeepSpeech)在梅尔声谱图(mel-spectrogram)上工作——把频率映射到梅尔刻度,更符合人耳对音高的感知。

### 混叠

如果信号含有高于 fs/2(奈奎斯特频率)的频率,以 fs 采样就会产生混叠副本。一个 90 Hz 的信号以 100 Hz 采样,看起来和一个 10 Hz 的信号一模一样——仅凭样本无法区分。

```
Example:
  True signal: 90 Hz sine wave
  Sampling rate: 100 Hz
  Apparent frequency: 100 - 90 = 10 Hz

  The samples from the 90 Hz signal at 100 Hz sampling rate
  are identical to the samples from a 10 Hz signal.
  No amount of math can recover the original 90 Hz.
```

这就是为什么模数转换器要在采样之前加抗混叠滤波器,把奈奎斯特以上的频率滤掉。在机器学习里,对特征图做下采样而缺少恰当的低通滤波时也会出现混叠——有些架构用抗混叠池化层来解决这个问题。

### 补零并不能提高分辨率

一个常见误解:在 FFT 之前给信号补零可以提高频率分辨率。不能。补零只是在已有的频率点之间做插值,让频谱看起来更平滑,它无法揭示原始样本中根本不存在的频率细节。

真正的频率分辨率只取决于观测时长 T = N / fs。要区分相距 delta_f 的两个频率,你至少需要 T = 1 / delta_f 秒的数据。再多补零也改变不了这个基本极限。

```figure
fourier-synthesis
```

## 动手构建

### 第 1 步:从零实现 DFT

O(N^2) 的 DFT 直接按定义写出来即可。

```python
import math

class Complex:
    ...

def dft(x):
    N = len(x)
    result = []
    for k in range(N):
        total = Complex(0, 0)
        for n in range(N):
            angle = -2 * math.pi * k * n / N
            w = Complex(math.cos(angle), math.sin(angle))
            xn = x[n] if isinstance(x[n], Complex) else Complex(x[n])
            total = total + xn * w
        result.append(total)
    return result
```

### 第 2 步:逆 DFT

结构相同,指数取正,除以 N。

```python
def idft(X):
    N = len(X)
    result = []
    for n in range(N):
        total = Complex(0, 0)
        for k in range(N):
            angle = 2 * math.pi * k * n / N
            w = Complex(math.cos(angle), math.sin(angle))
            total = total + X[k] * w
        result.append(Complex(total.real / N, total.imag / N))
    return result
```

### 第 3 步:FFT(Cooley-Tukey)

递归 FFT 要求长度为 2 的幂。拆成偶、奇两半,递归,再用旋转因子合并。

```python
def fft(x):
    N = len(x)
    if N <= 1:
        return [x[0] if isinstance(x[0], Complex) else Complex(x[0])]
    if N % 2 != 0:
        return dft(x)

    even = fft([x[i] for i in range(0, N, 2)])
    odd = fft([x[i] for i in range(1, N, 2)])

    result = [Complex(0)] * N
    for k in range(N // 2):
        angle = -2 * math.pi * k / N
        twiddle = Complex(math.cos(angle), math.sin(angle))
        t = twiddle * odd[k]
        result[k] = even[k] + t
        result[k + N // 2] = even[k] - t
    return result
```

### 第 4 步:频谱分析辅助函数

```python
def power_spectrum(X):
    return [xk.real ** 2 + xk.imag ** 2 for xk in X]

def convolve_fft(x, h):
    N = len(x) + len(h) - 1
    padded_N = 1
    while padded_N < N:
        padded_N *= 2

    x_padded = x + [0.0] * (padded_N - len(x))
    h_padded = h + [0.0] * (padded_N - len(h))

    X = fft(x_padded)
    H = fft(h_padded)

    Y = [xk * hk for xk, hk in zip(X, H)]

    y = idft(Y)
    return [y[n].real for n in range(N)]
```

## 投入使用

实际工作中用 numpy 的 FFT,它底层是高度优化的 C 库。

```python
import numpy as np

signal = np.sin(2 * np.pi * 5 * np.arange(256) / 256)
spectrum = np.fft.fft(signal)
freqs = np.fft.fftfreq(256, d=1/256)

power = np.abs(spectrum) ** 2

positive_freqs = freqs[:len(freqs)//2]
positive_power = power[:len(power)//2]
```

加窗和更高级的频谱分析:

```python
from scipy.signal import windows, stft

window = windows.hann(256)
windowed = signal * window
spectrum = np.fft.fft(windowed)
```

卷积:

```python
from scipy.signal import fftconvolve

result = fftconvolve(signal, kernel, mode='full')
```

声谱图:

```python
from scipy.signal import stft

frequencies, times, Zxx = stft(signal, fs=sample_rate, nperseg=256)
spectrogram = np.abs(Zxx) ** 2
```

声谱图矩阵的形状是 (n_frequencies, n_time_frames),每一列是一个时间窗上的功率谱。这正是音频机器学习模型的输入。

## 交付

运行 `code/fourier.py`,生成 `outputs/prompt-spectral-analyzer.md`。

## 练习

1. **识别纯音。** 构造一个单一未知频率(1 到 50 Hz 之间)的正弦波信号,以 128 Hz 采样 1 秒。用你的 DFT 找出这个频率,并验证答案正确。然后加入标准差为 0.5 的高斯噪声重做一遍。噪声对频谱有什么影响?

2. **FFT 与 DFT 互验。** 生成一个长度为 64 的随机信号,分别用 DFT(O(N^2))和 FFT 计算,验证所有系数在 1e-10 误差内一致。再对长度 256、512、1024、2048 的信号分别计时,画出 DFT 耗时与 FFT 耗时的比值。

3. **用例子证明卷积定理。** 构造信号 x = [1, 2, 3, 4, 0, 0, 0, 0] 和滤波器 h = [1, 1, 1, 0, 0, 0, 0, 0]。直接(嵌套循环)计算它们的循环卷积,再用 FFT(变换、相乘、逆变换)计算,验证两者一致。然后通过恰当的补零实现线性卷积。

4. **加窗的效果。** 构造一个由 10 Hz 和 12 Hz 两个正弦波叠加的信号(频率非常接近),以 128 Hz 采样 1 秒。分别在不加窗、Hann 窗、Hamming 窗下计算功率谱。哪种窗最容易分辨两个峰?为什么?

5. **位置编码分析。** 生成 d_model = 128、max_pos = 512 的正弦位置编码。对每对位置 (p1, p2),计算它们编码的点积,证明点积只取决于 |p1 - p2|,与绝对位置无关。随着距离增大,点积会如何变化?

## 关键术语

| 术语 | 含义 |
|------|---------------|
| DFT(离散傅里叶变换) | 把 N 个时域样本转换为 N 个频域系数,每个系数是信号与该频率复正弦的相关值 |
| FFT(快速傅里叶变换) | 以 O(N log N) 计算 DFT 的算法,Cooley-Tukey 算法按奇偶下标递归拆分 |
| 逆 DFT(Inverse DFT) | 从频率系数重建时域信号,公式与 DFT 相同,仅指数符号翻转并缩放 1/N |
| 频率槽(Frequency bin) | DFT 输出中的每个下标 k 代表频率 k*fs/N Hz,"槽"就是这个离散的频率位置 |
| 直流分量(DC component) | X[0],零频率系数,与信号均值成正比 |
| 奈奎斯特频率(Nyquist frequency) | fs/2,采样率 fs 下可表示的最高频率,超过它会发生混叠 |
| 功率谱(Power spectrum) | \|X[k]\|^2,各频率系数的模长平方,展示能量在频率上的分布 |
| 相位谱(Phase spectrum) | angle(X[k]),各频率分量的相位偏移,分析中常被忽略 |
| 频谱泄漏(Spectral leakage) | 把非周期信号当作周期信号处理而产生的虚假频率成分,加窗可以减轻 |
| 窗函数(Window function) | DFT 之前施加的收窄函数(Hann、Hamming、Blackman),用于减少频谱泄漏 |
| 旋转因子(Twiddle factor) | FFT 蝶形运算中用来合并子 DFT 的复指数 e^(-2*pi*i*k/N) |
| 卷积定理(Convolution theorem) | 时域卷积等于频域逐点相乘,是信号处理与 CNN 的基石 |
| 循环卷积(Circular convolution) | 信号首尾环绕相接的卷积,DFT 天然计算的就是它 |
| 线性卷积(Linear convolution) | 不环绕的标准卷积,DFT 之前补零即可实现 |
| 帕塞瓦尔定理(Parseval's theorem) | 总能量在傅里叶变换前后守恒:sum \|x[n]\|^2 = (1/N) sum \|X[k]\|^2 |
| 混叠(Aliasing) | 采样率不足时,高于奈奎斯特的频率显现为较低频率的现象 |

## 延伸阅读

- [Cooley & Tukey: An Algorithm for the Machine Calculation of Complex Fourier Series (1965)](https://www.ams.org/journals/mcom/1965-19-090/S0025-5718-1965-0178586-1/)——改变计算史的 FFT 原始论文
- [3Blue1Brown: But what is the Fourier Transform?](https://www.youtube.com/watch?v=spUNpyF58BY)——傅里叶变换最好的可视化入门
- [Lee-Thorp et al.: FNet: Mixing Tokens with Fourier Transforms (2021)](https://arxiv.org/abs/2105.03824)——在 Transformer 中用 FFT 替代自注意力
- [Smith: The Scientist and Engineer's Guide to Digital Signal Processing](http://www.dspguide.com/)——免费在线教材,深入讲解 FFT、加窗与频谱分析
- [Vaswani et al.: Attention Is All You Need (2017)](https://arxiv.org/abs/1706.03762)——从傅里叶频率分解推导出的正弦位置编码
- [Radford et al.: Whisper (2022)](https://arxiv.org/abs/2212.04356)——以梅尔声谱图为输入表示的语音识别
