> 本文转载自[《动手学深度学习》](https://zh.d2l.ai/)(作者:Aston Zhang、Zachary C. Lipton、李沐、Alexander J. Smola),原文:<https://zh.d2l.ai/chapter_multilayer-perceptrons/mlp-concise.html>。著作权归原作者所有,原书采用 CC BY-SA 4.0 许可,本站仅供个人学习使用。

# 多层感知机的简洁实现

本节将介绍(**通过高级API更简洁地实现多层感知机**)。

```python
from d2l import mxnet as d2l
from mxnet import gluon, init, npx
from mxnet.gluon import nn
npx.set_np()
```

```python
#@tab pytorch
from d2l import torch as d2l
import torch
from torch import nn
```

```python
#@tab tensorflow
from d2l import tensorflow as d2l
import tensorflow as tf
```

```python
#@tab paddle
from d2l import paddle as d2l
import warnings
warnings.filterwarnings("ignore")
import paddle
from paddle import nn
```

## 模型

与softmax回归的简洁实现（ 相关章节）相比，
唯一的区别是我们添加了2个全连接层（之前我们只添加了1个全连接层）。
第一层是[**隐藏层**]，它(**包含256个隐藏单元，并使用了ReLU激活函数**)。
第二层是输出层。

```python
net = nn.Sequential()
net.add(nn.Dense(256, activation='relu'),
        nn.Dense(10))
net.initialize(init.Normal(sigma=0.01))
```

```python
#@tab pytorch
net = nn.Sequential(nn.Flatten(),
                    nn.Linear(784, 256),
                    nn.ReLU(),
                    nn.Linear(256, 10))

def init_weights(m):
    if type(m) == nn.Linear:
        nn.init.normal_(m.weight, std=0.01)

net.apply(init_weights);
```

```python
#@tab tensorflow
net = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dense(10)])
```

```python
#@tab paddle
net = nn.Sequential(nn.Flatten(),
                    nn.Linear(784, 256),
                    nn.ReLU(),
                    nn.Linear(256, 10))


for layer in net:
    if type(layer) == nn.Linear:
        weight_attr = paddle.framework.ParamAttr(initializer=paddle.nn.initializer.Normal(mean=0.0, std=0.01))
        layer.weight_attr = weight_attr
```

[**训练过程**]的实现与我们实现softmax回归时完全相同，
这种模块化设计使我们能够将与模型架构有关的内容独立出来。

```python
batch_size, lr, num_epochs = 256, 0.1, 10
loss = gluon.loss.SoftmaxCrossEntropyLoss()
trainer = gluon.Trainer(net.collect_params(), 'sgd', {'learning_rate': lr})
```

```python
#@tab pytorch
batch_size, lr, num_epochs = 256, 0.1, 10
loss = nn.CrossEntropyLoss(reduction='none')
trainer = torch.optim.SGD(net.parameters(), lr=lr)
```

```python
#@tab tensorflow
batch_size, lr, num_epochs = 256, 0.1, 10
loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
trainer = tf.keras.optimizers.SGD(learning_rate=lr)
```

```python
#@tab paddle
batch_size, lr, num_epochs = 256, 0.1, 10
loss = nn.CrossEntropyLoss(reduction='none')
trainer = paddle.optimizer.SGD(parameters=net.parameters(), learning_rate=lr)
```

```python
#@tab all
train_iter, test_iter = d2l.load_data_fashion_mnist(batch_size)
d2l.train_ch3(net, train_iter, test_iter, loss, num_epochs, trainer)
```

## 小结

* 我们可以使用高级API更简洁地实现多层感知机。
* 对于相同的分类问题，多层感知机的实现与softmax回归的实现相同，只是多层感知机的实现里增加了带有激活函数的隐藏层。

## 练习

1. 尝试添加不同数量的隐藏层（也可以修改学习率），怎么样设置效果最好？
1. 尝试不同的激活函数，哪个效果最好？
1. 尝试不同的方案来初始化权重，什么方法效果最好？

[Discussions](https://discuss.d2l.ai/t/1803)

[Discussions](https://discuss.d2l.ai/t/1802)

[Discussions](https://discuss.d2l.ai/t/1801)

[Discussions](https://discuss.d2l.ai/t/11770)
