---
title: 安卓 APK 离线打包部署
date: 2026-07-28
category:
  - 运维与部署
tag:
  - Android
  - Capacitor
  - APK
  - VuePress
---

# 安卓 APK 离线打包部署

把本博客(VuePress 静态站点)通过 **Capacitor** 离线打包成安卓安装包(APK)的完整流程。打包后 App 无需联网即可浏览全部文档。

产出物:`异星基站-debug.apk`(约 566 MB,debug 签名,可直接安装)。

## 一、环境准备

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| JDK | 17 | `java -version` 验证 |
| Node / pnpm | 22 / 10 | 项目已有 |
| Android SDK | platform-34 + build-tools 34 | 见下文安装 |
| Capacitor | 6.x | 兼容 JDK 17 |

### 安装 Android SDK(无 Android Studio)

1. 下载命令行工具:[commandlinetools-win](https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip)
2. 解压为 `%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\`(注意必须多一层 `latest`)
3. 安装组件并接受协议:

```powershell
$sdkm = "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"
1..30 | ForEach-Object { "y" } | & $sdkm --licenses
& $sdkm "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

4. 持久化环境变量:

```powershell
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
```

## 二、构建静态站点(注意内存)

::: warning 大站必看:Node 堆内存
本站有 2100+ 页面,vite 编译峰值内存超过 8 GB,默认 4 GB 堆必然 OOM。必须加大堆(与 `.github/workflows/deploy-docs.yml` 的 CI 方案一致):
:::

```bash
NODE_OPTIONS="--max-old-space-size=16384" pnpm docs:build
```

产物输出到 `src/.vuepress/dist`(约 910 MB,其中音频 475 MB)。

## 三、接入 Capacitor

```bash
pnpm add -D @capacitor/cli@^6
pnpm add @capacitor/core@^6 @capacitor/android@^6
```

新建 `capacitor.config.json`(用 JSON 而不是 TS,否则需要额外安装 TypeScript):

```json
{
  "appId": "io.github.moklgydocs",
  "appName": "异星基站",
  "webDir": "src/.vuepress/dist"
}
```

生成安卓工程(会把 dist 全量拷入 `android/app/src/main/assets/public`):

```bash
npx cap add android
```

## 四、编译 APK(中文路径坑)

::: danger 非 ASCII 路径
本仓库路径含中文(`E:\博客\...`),AGP 会直接拒绝构建:

`Your project path contains non-ASCII characters. Please move your project to a different directory.`

不建议用 `android.overridePathCheck=true` 硬绕过(资源编译阶段仍可能炸),稳妥做法是**镜像到纯英文暂存目录编译**。
:::

### 4.1 镜像到暂存区

```powershell
robocopy "E:\博客\moklgydocs.github.io\android" "E:\apk_build\android" /MIR
```

### 4.2 修复 capacitor-android 库引用

`cap add android` 生成的 `capacitor.settings.gradle` 用**相对路径** `../node_modules/...` 引用 Capacitor 安卓库,暂存区没有 node_modules,需要把库本体拷出来并改指向:

```powershell
robocopy "E:\博客\moklgydocs.github.io\node_modules\.pnpm\@capacitor+android@6.2.1_@capacitor+core@6.2.1\node_modules\@capacitor\android\capacitor" "E:\apk_build\capacitor-android" /MIR
```

修改**暂存区**的 `E:\apk_build\android\capacitor.settings.gradle`(仓库原版不要动,它由 `cap update` 重新生成):

```gradle
include ':capacitor-android'
project(':capacitor-android').projectDir = new File('E:/apk_build/capacitor-android')
```

### 4.3 配置 SDK 路径并编译

`android/local.properties`:

```properties
sdk.dir=C:/Users/<用户名>/AppData/Local/Android/Sdk
```

```powershell
cd E:\apk_build\android
.\gradlew.bat assembleDebug --console=plain
```

首次构建会下载 Gradle 发行版(约 130 MB)和 AGP 依赖(数百 MB)。

产物:`E:\apk_build\android\app\build\outputs\apk\debug\app-debug.apk`

## 五、安装到手机

```bash
# 方式一:USB 调试
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb install app-debug.apk

# 方式二:拷贝到手机点击安装(需允许"未知来源")
```

## 六、日常重打流程

内容更新后:

```bash
# 1. 重新构建站点
NODE_OPTIONS="--max-old-space-size=16384" pnpm docs:build

# 2. 同步资源到 android 工程
npx cap sync

# 3. 剔除超大音频:逐句原文件(App 只用整集拼接版 episodes/,页面零引用)+第四季起的原声(见第八节)
rm -rf android/app/src/main/assets/public/audio/friends
rm -rf android/app/src/main/assets/public/audio/friends-tv/S{04,05,06,07,08,09,10}

# 4. 镜像到暂存区并编译
robocopy android E:\apk_build\android /MIR
cd E:\apk_build\android
.\gradlew.bat assembleDebug
```

## 七、常见问题

| 问题 | 原因 | 解决 |
| --- | --- | --- |
| `JavaScript heap out of memory` | 堆太小 | `NODE_OPTIONS=--max-old-space-size=16384` |
| `Could not find installation of TypeScript` | 用了 `capacitor.config.ts` 但没装 TS | 改用 `capacitor.config.json` |
| `non-ASCII characters` | 仓库路径含中文 | 镜像到英文路径暂存区编译 |
| `Could not resolve project :capacitor-android` | 暂存区相对路径找不到 node_modules | 拷出库本体,settings.gradle 改绝对路径 |
| `<script setup>` 中报 `Unexpected token` | md 内联脚本字符串引号嵌套(如 `'我叫'阿雪''`) | 内层改全角引号 `‘’` 或换双引号 |
| `Too many zip entries (MAX=65535)` | APK 是 ZIP,条目数硬上限 | 逐句音频无损拼接为整集,片段播放 |
| `Zip32 ... MAX=4294967295` | APK 包体硬上限 4GB | 大体积音频改外置数据包(见第八节) |

## 八、外置原声数据包(第四季起)

老友记剧集原声共约 3.6GB,全量打进 APK 会超 4GB 上限。按季拆分:

- **S01-S03(约 1.1GB):随 APK 内置**,安装即可播放
- **S04-S10(约 2.5GB):外置数据包**,单独分发,应用内直接读取,**免解压、免导入**

### 安装步骤

1. 安装主 APK(约 3.2GB,含前三季原声)。
2. 把数据包文件夹 `friends-tv`(只需 S04-S10 七个子目录)拷到设备:

```
内部存储/Android/data/io.github.moklgydocs/files/audio/friends-tv
```

(`audio` 目录不存在就新建;最终路径下应是 `S04/S04E01.mp3` 这样的结构)

3. 打开应用,第四季起任意一集顶部播放器即可播放原声;前三季无需数据包;逐句 TTS 按钮不受影响。

- 手机:可用 `adb push friends-tv/S04 friends-tv/S05 friends-tv/S06 friends-tv/S07 friends-tv/S08 friends-tv/S09 friends-tv/S10 /sdcard/Android/data/io.github.moklgydocs/files/audio/friends-tv/`
- 智慧屏:U盘拷贝后用文件管理器移动,或先 adb 推送。
- 未放数据包时第四季起的播放器无声,其余功能正常。

## 九、后续可选项

- **Release 签名包**:生成 keystore → `android/app/build.gradle` 配 `signingConfigs` → `assembleRelease`,适合分发上架。
- **体积瘦身**:音频(475 MB)改为在线加载或按需下载,APK 可缩到 100 MB 级。
- **TWA 方案**:站点已部署 GitHub Pages,也可用 Bubblewrap 做 Trusted Web Activity,体积小但必须联网。
