---
icon: bolt
category:
  - 前端开发
tag:
  - TypeScript
  - Axios
---

# TypeScript 从零实现 axios

## 01.初识 TypeScript
- [01.简介](/前端开发/TypeScript%20从零实现%20axios/01.%E5%88%9D%E8%AF%86%20TypeScript/01.%E7%AE%80%E4%BB%8B.md)
- [02.安装 TypeScript](/前端开发/TypeScript%20从零实现%20axios/01.%E5%88%9D%E8%AF%86%20TypeScript/02.%E5%AE%89%E8%A3%85%20TypeScript.md)
- [03.编写第一个 TypeScript 程序](/前端开发/TypeScript%20从零实现%20axios/01.%E5%88%9D%E8%AF%86%20TypeScript/03.%E7%BC%96%E5%86%99%E7%AC%AC%E4%B8%80%E4%B8%AA%20TypeScript%20%E7%A8%8B%E5%BA%8F.md)
## 02.TypeScript 常用语法
- [01.基础类型](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/01.%E5%9F%BA%E7%A1%80%E7%B1%BB%E5%9E%8B.md)
- [02.变量声明](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/02.%E5%8F%98%E9%87%8F%E5%A3%B0%E6%98%8E.md)
- [03.接口](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/03.%E6%8E%A5%E5%8F%A3.md)
- [04.类](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/04.%E7%B1%BB.md)
- [05.函数](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/05.%E5%87%BD%E6%95%B0.md)
- [06.泛型](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/06.%E6%B3%9B%E5%9E%8B.md)
- [07.类型推断](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/07.%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD.md)
- [08.高级类型](/前端开发/TypeScript%20从零实现%20axios/02.TypeScript%20%E5%B8%B8%E7%94%A8%E8%AF%AD%E6%B3%95/08.%E9%AB%98%E7%BA%A7%E7%B1%BB%E5%9E%8B.md)
## 03.ts-axios 项目初始化
- [01.需求分析](/前端开发/TypeScript%20从零实现%20axios/03.ts-axios%20%E9%A1%B9%E7%9B%AE%E5%88%9D%E5%A7%8B%E5%8C%96/01.%E9%9C%80%E6%B1%82%E5%88%86%E6%9E%90.md)
- [02.初始化项目](/前端开发/TypeScript%20从零实现%20axios/03.ts-axios%20%E9%A1%B9%E7%9B%AE%E5%88%9D%E5%A7%8B%E5%8C%96/02.%E5%88%9D%E5%A7%8B%E5%8C%96%E9%A1%B9%E7%9B%AE.md)
- [03.编写基础请求代码](/前端开发/TypeScript%20从零实现%20axios/03.ts-axios%20%E9%A1%B9%E7%9B%AE%E5%88%9D%E5%A7%8B%E5%8C%96/03.%E7%BC%96%E5%86%99%E5%9F%BA%E7%A1%80%E8%AF%B7%E6%B1%82%E4%BB%A3%E7%A0%81.md)
## 04.ts-axios 基础功能实现
- [01.处理请求 url 参数](/前端开发/TypeScript%20从零实现%20axios/04.ts-axios%20%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/01.%E5%A4%84%E7%90%86%E8%AF%B7%E6%B1%82%20url%20%E5%8F%82%E6%95%B0.md)
- [02.处理请求 body 数据](/前端开发/TypeScript%20从零实现%20axios/04.ts-axios%20%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/02.%E5%A4%84%E7%90%86%E8%AF%B7%E6%B1%82%20body%20%E6%95%B0%E6%8D%AE.md)
- [03.处理请求 header](/前端开发/TypeScript%20从零实现%20axios/04.ts-axios%20%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/03.%E5%A4%84%E7%90%86%E8%AF%B7%E6%B1%82%20header.md)
- [04.获取响应数据](/前端开发/TypeScript%20从零实现%20axios/04.ts-axios%20%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/04.%E8%8E%B7%E5%8F%96%E5%93%8D%E5%BA%94%E6%95%B0%E6%8D%AE.md)
- [05.处理响应 header](/前端开发/TypeScript%20从零实现%20axios/04.ts-axios%20%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/05.%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%20header.md)
- [06.处理响应 data](/前端开发/TypeScript%20从零实现%20axios/04.ts-axios%20%E5%9F%BA%E7%A1%80%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/06.%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%20data.md)
## 05.ts-axios 异常情况处理
- [01.错误处理](/前端开发/TypeScript%20从零实现%20axios/05.ts-axios%20%E5%BC%82%E5%B8%B8%E6%83%85%E5%86%B5%E5%A4%84%E7%90%86/01.%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86.md)
- [02.错误信息增强](/前端开发/TypeScript%20从零实现%20axios/05.ts-axios%20%E5%BC%82%E5%B8%B8%E6%83%85%E5%86%B5%E5%A4%84%E7%90%86/02.%E9%94%99%E8%AF%AF%E4%BF%A1%E6%81%AF%E5%A2%9E%E5%BC%BA.md)
## 06.ts-axios 接口扩展
- [01.扩展接口](/前端开发/TypeScript%20从零实现%20axios/06.ts-axios%20%E6%8E%A5%E5%8F%A3%E6%89%A9%E5%B1%95/01.%E6%89%A9%E5%B1%95%E6%8E%A5%E5%8F%A3.md)
- [02.axios 函数重载](/前端开发/TypeScript%20从零实现%20axios/06.ts-axios%20%E6%8E%A5%E5%8F%A3%E6%89%A9%E5%B1%95/02.axios%20%E5%87%BD%E6%95%B0%E9%87%8D%E8%BD%BD.md)
- [03.响应数据支持泛型](/前端开发/TypeScript%20从零实现%20axios/06.ts-axios%20%E6%8E%A5%E5%8F%A3%E6%89%A9%E5%B1%95/03.%E5%93%8D%E5%BA%94%E6%95%B0%E6%8D%AE%E6%94%AF%E6%8C%81%E6%B3%9B%E5%9E%8B.md)
## 07.ts-axios 拦截器实现
- [01.拦截器设计与实现](/前端开发/TypeScript%20从零实现%20axios/07.ts-axios%20%E6%8B%A6%E6%88%AA%E5%99%A8%E5%AE%9E%E7%8E%B0/01.%E6%8B%A6%E6%88%AA%E5%99%A8%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0.md)
## 08.ts-axios 配置化实现
- [01.合并配置的设计与实现](/前端开发/TypeScript%20从零实现%20axios/08.ts-axios%20%E9%85%8D%E7%BD%AE%E5%8C%96%E5%AE%9E%E7%8E%B0/01.%E5%90%88%E5%B9%B6%E9%85%8D%E7%BD%AE%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0.md)
- [02.请求和响应配置化](/前端开发/TypeScript%20从零实现%20axios/08.ts-axios%20%E9%85%8D%E7%BD%AE%E5%8C%96%E5%AE%9E%E7%8E%B0/02.%E8%AF%B7%E6%B1%82%E5%92%8C%E5%93%8D%E5%BA%94%E9%85%8D%E7%BD%AE%E5%8C%96.md)
- [03.扩展 create 静态接口](/前端开发/TypeScript%20从零实现%20axios/08.ts-axios%20%E9%85%8D%E7%BD%AE%E5%8C%96%E5%AE%9E%E7%8E%B0/03.%E6%89%A9%E5%B1%95%20create%20%E9%9D%99%E6%80%81%E6%8E%A5%E5%8F%A3.md)
## 09.ts-axios 取消功能实现
- [01.取消功能的设计与实现](/前端开发/TypeScript%20从零实现%20axios/09.ts-axios%20%E5%8F%96%E6%B6%88%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/01.%E5%8F%96%E6%B6%88%E5%8A%9F%E8%83%BD%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0.md)
## 10.ts-axios 更多功能实现
- [01.withCredentials](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/01.withCredentials.md)
- [02.XSRF 防御](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/02.XSRF%20%E9%98%B2%E5%BE%A1.md)
- [03.上传和下载的进度监控](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/03.%E4%B8%8A%E4%BC%A0%E5%92%8C%E4%B8%8B%E8%BD%BD%E7%9A%84%E8%BF%9B%E5%BA%A6%E7%9B%91%E6%8E%A7.md)
- [04.HTTP 授权](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/04.HTTP%20%E6%8E%88%E6%9D%83.md)
- [05.自定义合法状态码](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/05.%E8%87%AA%E5%AE%9A%E4%B9%89%E5%90%88%E6%B3%95%E7%8A%B6%E6%80%81%E7%A0%81.md)
- [06.自定义参数序列化](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/06.%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%82%E6%95%B0%E5%BA%8F%E5%88%97%E5%8C%96.md)
- [07.baseURL](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/07.baseURL.md)
- [08.静态方法扩展](/前端开发/TypeScript%20从零实现%20axios/10.ts-axios%20%E6%9B%B4%E5%A4%9A%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0/08.%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95%E6%89%A9%E5%B1%95.md)
## 11.ts-axios 单元测试
- [01.前言](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/01.%E5%89%8D%E8%A8%80.md)
- [02.Jest 安装和配置](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/02.Jest%20%E5%AE%89%E8%A3%85%E5%92%8C%E9%85%8D%E7%BD%AE.md)
- [03.辅助模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/03.%E8%BE%85%E5%8A%A9%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [04.请求模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/04.%E8%AF%B7%E6%B1%82%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [05.headers 模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/05.headers%20%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [06.Axios 实例模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/06.Axios%20%E5%AE%9E%E4%BE%8B%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [07.拦截器模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/07.%E6%8B%A6%E6%88%AA%E5%99%A8%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [08.mergeConfig 模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/08.mergeConfig%20%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [09.请求取消模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/09.%E8%AF%B7%E6%B1%82%E5%8F%96%E6%B6%88%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
- [10.剩余模块单元测试](/前端开发/TypeScript%20从零实现%20axios/11.ts-axios%20%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95/10.%E5%89%A9%E4%BD%99%E6%A8%A1%E5%9D%97%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95.md)
## 12.ts-axios 部署与发布
- [01.ts-axios 编译与发布](/前端开发/TypeScript%20从零实现%20axios/12.ts-axios%20%E9%83%A8%E7%BD%B2%E4%B8%8E%E5%8F%91%E5%B8%83/01.ts-axios%20%E7%BC%96%E8%AF%91%E4%B8%8E%E5%8F%91%E5%B8%83.md)
- [02.引用 ts-axios 库](/前端开发/TypeScript%20从零实现%20axios/12.ts-axios%20%E9%83%A8%E7%BD%B2%E4%B8%8E%E5%8F%91%E5%B8%83/02.%E5%BC%95%E7%94%A8%20ts-axios%20%E5%BA%93.md)

