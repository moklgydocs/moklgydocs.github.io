# GPU 配置与云端

> 学习阶段用 CPU 训练没问题,动真格的训练得靠 GPU。

**类型:** 动手构建
**编程语言:** Python
**前置要求:** 第 0 阶段,第 01 课
**预计耗时:** 约 45 分钟

## 学习目标

- 使用 `nvidia-smi` 和 PyTorch 的 CUDA API 验证本地 GPU 是否可用
- 在 Google Colab 上配置 T4 GPU,免费进行云端实验
- 对 CPU 与 GPU 的矩阵乘法做基准测试,测量加速比
- 用半精度(fp16)经验法则估算显存(VRAM)能容纳的最大模型

## 问题

第 1-3 阶段的大多数课程在 CPU 上就能顺利运行。但一旦开始训练 CNN、Transformer 或大语言模型(LLM)(第 4 阶段起),就需要 GPU 加速了。同一个训练任务,CPU 上要跑 8 小时,GPU 上只需 10 分钟。

你有三个选择:本地 GPU、云端 GPU,或 Google Colab(免费)。

## 概念

```
Your options:

1. Local NVIDIA GPU
   Cost: $0 (you already have it)
   Setup: Install CUDA + cuDNN
   Best for: Regular use, large datasets

2. Google Colab (free tier)
   Cost: $0
   Setup: None
   Best for: Quick experiments, no GPU at home

3. Cloud GPU (Lambda, RunPod, Vast.ai)
   Cost: $0.20-2.00/hr
   Setup: SSH + install
   Best for: Serious training, large models
```

```figure
s0-gpu-dispatch
```

## 动手构建

### 方案 1:本地 NVIDIA GPU

检查你是否有 GPU:

```bash
nvidia-smi
```

安装带 CUDA 的 PyTorch:

```python
import torch

print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
```

### 方案 2:Google Colab

1. 打开 [colab.research.google.com](https://colab.research.google.com)
2. 依次点击 Runtime > Change runtime type > T4 GPU
3. 运行 `!nvidia-smi` 验证

可以把本课程的 notebook 直接上传到 Colab。

### 方案 3:云端 GPU

以 Lambda Labs、RunPod 或 Vast.ai 为例:

```bash
ssh user@your-gpu-instance

pip install torch torchvision torchaudio
python -c "import torch; print(torch.cuda.get_device_name(0))"
```

### 没有 GPU?没问题

大多数课程在 CPU 上就能跑。需要 GPU 的课程会特别注明,并附上 Colab 链接。

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using: {device}")
```

## 动手构建:GPU vs CPU 基准测试

```python
import torch
import time

size = 5000

a_cpu = torch.randn(size, size)
b_cpu = torch.randn(size, size)

start = time.time()
c_cpu = a_cpu @ b_cpu
cpu_time = time.time() - start
print(f"CPU: {cpu_time:.3f}s")

if torch.cuda.is_available():
    a_gpu = a_cpu.to("cuda")
    b_gpu = b_cpu.to("cuda")

    torch.cuda.synchronize()
    start = time.time()
    c_gpu = a_gpu @ b_gpu
    torch.cuda.synchronize()
    gpu_time = time.time() - start
    print(f"GPU: {gpu_time:.3f}s")
    print(f"Speedup: {cpu_time / gpu_time:.0f}x")
```

## 练习

1. 运行上面的基准测试,对比 CPU 与 GPU 的耗时
2. 如果你没有 GPU,就在 Google Colab 上运行并对比
3. 查看你的显存容量,估算能容纳的最大模型(经验法则:fp16 下每个参数占 2 字节)

## 关键术语

| 术语 | 人们的说法 | 实际含义 |
|------|----------------|----------------------|
| CUDA | "GPU 编程" | NVIDIA 的并行计算平台,让你能在 GPU 上运行代码 |
| 显存(VRAM) | "GPU 内存" | GPU 上的显存,独立于系统内存,决定了模型大小的上限。 |
| fp16 | "半精度" | 16 位浮点数,内存占用只有 fp32 的一半,精度损失极小 |
| 张量核心(Tensor Core) | "快速矩阵硬件" | 专为矩阵乘法设计的 GPU 核心,比普通核心快 4-8 倍 |
