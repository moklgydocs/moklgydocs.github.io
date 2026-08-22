> 本文转载自[《动手学深度学习》](https://zh.d2l.ai/)(作者:Aston Zhang、Zachary C. Lipton、李沐、Alexander J. Smola),原文:<https://zh.d2l.ai/chapter_preliminaries/lookup-api.html>。著作权归原作者所有,原书采用 CC BY-SA 4.0 许可,本站仅供个人学习使用。

# 查阅文档

由于篇幅限制，本书不可能介绍每一个MXNet函数和类。
API文档、其他教程和示例提供了本书之外的大量文档。
本节提供了一些查看MXNet API的指导。

由于篇幅限制，本书不可能介绍每一个PyTorch函数和类。
API文档、其他教程和示例提供了本书之外的大量文档。
本节提供了一些查看PyTorch API的指导。

由于篇幅限制，本书不可能介绍每一个TensorFlow函数和类。
API文档、其他教程和示例提供了本书之外的大量文档。
本节提供了一些查TensorFlow API的指导。

## 查找模块中的所有函数和类

为了知道模块中可以调用哪些函数和类，可以调用`dir`函数。
例如，我们可以(**查询随机数生成模块中的所有属性：**)

```python
from mxnet import np
print(dir(np.random))
```

```python
#@tab pytorch
import torch
print(dir(torch.distributions))
```

```python
#@tab tensorflow
import tensorflow as tf
print(dir(tf.random))
```

```python
#@tab paddle
import warnings
warnings.filterwarnings(action='ignore')
import paddle
print(dir(paddle.distribution))
```

通常可以忽略以“`__`”（双下划线）开始和结束的函数，它们是Python中的特殊对象，
或以单个“`_`”（单下划线）开始的函数，它们通常是内部函数。
根据剩余的函数名或属性名，我们可能会猜测这个模块提供了各种生成随机数的方法，
包括从均匀分布（`uniform`）、正态分布（`normal`）和多项分布（`multinomial`）中采样。

## 查找特定函数和类的用法

有关如何使用给定函数或类的更具体说明，可以调用`help`函数。
例如，我们来[**查看张量`ones`函数的用法。**]

```python
help(np.ones)
```

```python
#@tab pytorch
help(torch.ones)
```

```python
#@tab tensorflow
help(tf.ones)
```

```python
#@tab paddle
help(paddle.ones)
```

从文档中，我们可以看到`ones`函数创建一个具有指定形状的新张量，并将所有元素值设置为1。
下面来[**运行一个快速测试**]来确认这一解释：

```python
np.ones(4)
```

```python
#@tab pytorch
torch.ones(4)
```

```python
#@tab tensorflow
tf.ones(4)
```

```python
#@tab paddle
paddle.ones([4], dtype='float32')
```

在Jupyter记事本中，我们可以使用`?`指令在另一个浏览器窗口中显示文档。
例如，`list?`指令将创建与`help(list)`指令几乎相同的内容，并在新的浏览器窗口中显示它。
此外，如果我们使用两个问号，如`list??`，将显示实现该函数的Python代码。

## 小结

* 官方文档提供了本书之外的大量描述和示例。
* 可以通过调用`dir`和`help`函数或在Jupyter记事本中使用`?`和`??`查看API的用法文档。

## 练习

1. 在深度学习框架中查找任何函数或类的文档。请尝试在这个框架的官方网站上找到文档。

[Discussions](https://discuss.d2l.ai/t/1764)

[Discussions](https://discuss.d2l.ai/t/1765)

[Discussions](https://discuss.d2l.ai/t/1763)

[Discussions](https://discuss.d2l.ai/t/11686)
