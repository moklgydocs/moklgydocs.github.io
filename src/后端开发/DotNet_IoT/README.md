---
title: .NET Core + IoT 物联网全栈指南
index: false
icon: fa6-solid:microchip
order: 4
category:
  - IoT
  - DotNet
tag:
  - IoT
  - 物联网
  - .NET
  - 嵌入式
  - 边缘计算
  - MQTT
  - Azure IoT
---

# .NET Core + IoT 物联网全栈指南

> 从零到生产——用 .NET 技术栈打通物联网全链路。硬件接口、通信协议、边缘计算、云平台、安全认证、数据管道，一步步构建胜任物联网工作的完整知识体系。

## 参考资料

| 资料 | 说明 |
|------|------|
| [.NET IoT 官方文档](https://learn.microsoft.com/en-us/dotnet/iot/) | System.Device.Gpio / Iot.Device.Bindings |
| [Azure IoT 文档](https://learn.microsoft.com/en-us/azure/iot/) | Azure IoT Hub / Edge / DPS |
| [MQTT 5.0 规范](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html) | MQTT 协议官方规范 |
| 《物联网系统设计》 | 李驹光著，嵌入式视角 |
| 《IoT and Edge Computing for Architects》 | Perry Lea 著，架构师视角 |
| [nanoFramework](https://github.com/nanoframework) | .NET 微框架（MCU 开发） |
| [System.Device.Gpio 源码](https://github.com/dotnet/iot) | .NET IoT 官方仓库 |

## 学习路线

```mermaid
graph LR
    A[01 物联网基础] --> B[02 硬件接口]
    B --> C[03 通信协议]
    C --> D[04 传感器与执行器]
    D --> E[05 边缘计算与网关]
    E --> F[06 IoT平台与云服务]
    F --> G[07 安全与认证]
    G --> H[08 数据管道与分析]
    H --> I[09 生产级项目实战]
    I --> J[10 职业发展与面试]

    style A fill:#2196F3,color:#fff
    style J fill:#FF5722,color:#fff
```

## 章节导航

| 篇章 | 内容 | 文章数 |
|------|------|--------|
| [01 · 物联网基础](01_物联网基础/) | IoT 架构、.NET IoT 生态、开发环境搭建 | 3 |
| [02 · 硬件接口与 GPIO](02_硬件接口与GPIO/) | GPIO/I2C/SPI/UART/PWM、System.Device.Gpio | 4 |
| [03 · 通信协议](03_通信协议/) | MQTT/CoAP/HTTP/AMQP/Modbus、协议选型 | 4 |
| [04 · 传感器与执行器](04_传感器与执行器/) | 温湿度/加速度/GPS/继电器/电机、Iot.Device.Bindings | 3 |
| [05 · 边缘计算与网关](05_边缘计算与网关/) | Azure IoT Edge、自定义网关、消息路由 | 3 |
| [06 · IoT 平台与云服务](06_IoT平台与云服务/) | Azure IoT Hub/AWS IoT/EMQX/ThingsBoard | 3 |
| [07 · 安全与认证](07_安全与认证/) | TLS/证书/X.509/DPS/TPM、固件安全 | 3 |
| [08 · 数据管道与分析](08_数据管道与分析/) | 时序数据库/流处理/规则引擎/可视化 | 3 |
| [09 · 生产级项目实战](09_生产级项目实战/) | 智能家居/工业监控/农业物联网 | 3 |
| [10 · 职业发展与面试](10_职业发展与面试/) | IoT 架构师路线、面试题、认证考试 | 2 |
