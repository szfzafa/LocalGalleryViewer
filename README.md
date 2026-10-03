# README\.md

# LocalGalleryViewer

Some personal customizations based on localGalleryViewer Chrome Extension originally by Andreas Meyer\.

Official Original Extension Store: [https://chrome\.google\.com/webstore/detail/localgalleryviewerextensi/opheklanmaieaeneebdohfpbjkhcgilk](https://chrome.google.com/webstore/detail/localgalleryviewerextensi/opheklanmaieaeneebdohfpbjkhcgilk)

Please retain the original source attribution\. All modifications follow the original author’s license terms\. Use at your own risk\.

**Licensed under CC\-BY\-3\.0 Unported**

> \- Deeply modified from localGalleryViewerExtension 1\.4  
> \- Adopts browser File System Access API for direct local file movement operations  
> \- This project fully complies with the Creative Commons Attribution 3\.0 \(CC\-BY\-3\.0\) open source license
> 
> 

## Usage

### Extension Debug \& Launch

1\. Debug Mode: Load unpacked extension in Chrome, open `gallery.html`, select target directory via control panel, drag\-and\-drop folder is supported\.  
2\. Kiosk Full\-Screen Startup Parameter:

```Plain Text
chrome.exe --enable-easy-off-store-extension-install -kiosk chrome-extension://<EXTENSION_ID>/gallery.html
```

## New Features \& Optimizations

### Scaling \& Transition Enhancement

Enhanced scale\-fit adaptive scaling and automatic scrolling logic;  
transition effect optimized from old\-image fade\-out to new\-image fade\-in for smoother visual performance\.

- **scalefit=0**: Disabled, adapt to viewport and display the entire image

- **scalefit=1**: Semi\-enabled, single\-direction scrolling to browse full image content

- **scalefit=2**: Fully enabled, support single\-direction scrolling \+ automatic reciprocating scrolling; customizable initial position, direction, refresh rate, horizontal \& vertical scrolling speed

### Image \& Interactive Operations

- Left\-click: Pause / Resume slideshow playback

- Left/Right Arrow Keys: Switch previous / next media

- Mouse wheel zoom: Zoom centered at mouse pointer position

- Edge scrolling: Trigger auto\-scroll when mouse hovers at screen edges; support left\-drag image adjustment

- Mouse middle button: Reset image zoom and position

- Right\-click: Disable automatic scrolling \(only valid in kiosk mode\)

### Supported Media Formats

- Image: png, bmp, jpeg, jpg, gif, svg, xbm, webp

- Video: webm, mp4; Slideshow interval will be automatically adapted to be longer than video duration

### Keyboard Quick File Sorting

- 0\-9 Numeric Keys: Move current media file to the corresponding numbered subfolder in the current directory \(auto\-create folder if not exists\)

- DEL Key: Move current media file to `_TRASH_` recycle folder in the root directory \(no physical file deletion\)

- Moved files will be marked with dimmed style and strikethrough; slideshow will only traverse valid undeleted media files

- Dependency: Browser must support File System Access API

### Performance Optimization

- WebWorker asynchronous pre\-decoding for images larger than 2MB to eliminate main thread stuttering

- Canvas object pool reuse to reduce repeated rendering overhead and memory waste

- Built\-in screen wake lock to prevent automatic screen dimming and sleep

### Mobile Compatibility

Added mobile browser adaptation, tested and available on Android Kiwi Browser \(mobile file append mode fallback\)\.

## Project Changes

Upgraded extension manifest from V2 to Manifest V3 to adapt to modern browser specifications\.

## Known Issues \& Limitations

1. When the image aspect ratio is close to the window ratio, automatic scrolling animation may jitter; pause playback or switch media as a workaround

2. The scalefit switch UI status will not refresh automatically after modifying configurations, manual confirmation is required

3. scalefit=2 auto\-scrolling only supports `none` / `fade` transitions, other transition types will cause coordinate disorder

4. Auto\-scrolling consumes certain CPU resources; increase `fpsinterval` to reduce load \(value shall not be lower than the screen refresh cycle\)

5. Previous button under random mode returns random media instead of real backward playback

6. Screen tearing may occur during animation; need monitor and GPU vertical sync enabled

7. Hotkey file movement still takes effect after modifying control parameters after media loading; adjust settings before loading files

8. Inherited original project defect: no automatic EXIF rotation for mobile\-shot photos

9. Long\-duration GIF animations may be truncated due to undetectable full animation duration

10. File System Access API permission limitation: folder creation and file movement may fail in partial environments \(only console warning, no popup prompt\)

11. `parentDirHandle` will not update automatically after file movement; re\-scan the directory to refresh data

12. File movement to`_TRASH_` will fail when file names conflict \(browser API does not support automatic overwriting/renaming\)

13. Mobile browsers cannot enable desktop directory selection, automatically fall back to multi\-file append selection mode

---

# 中文说明

本项目基于 Andreas Meyer 开发的 localGalleryViewer 浏览器扩展进行深度二次定制开发，保留原版核心能力并新增大量交互、性能、适配功能。

原官方扩展商店地址：[https://chrome\.google\.com/webstore/detail/localgalleryviewerextensi/opheklanmaieaeneebdohfpbjkhcgilk](https://chrome.google.com/webstore/detail/localgalleryviewerextensi/opheklanmaieaeneebdohfpbjkhcgilk)

项目遵循 **CC\-BY\-3\.0 知识共享署名开源协议**，开源使用请保留原作者出处与版权声明，违规使用后果自负。

> \- 基于 localGalleryViewerExtension 1\.4 原版深度迭代修改  
> \- 依托浏览器 File System Access API，实现本地图片/视频快捷键分拣、移动等本地文件操作  
> \- 全项目遵循 CC\-BY\-3\.0 开源规范，可合规二次修改与分发（需遵守署名要求）
> 
> 

## 使用方法

### 扩展调试与启动

1\. 调试模式：Chrome 加载已解压扩展，打开 `gallery.html`，通过控制面板选择本地目录，支持文件夹拖拽导入；  
2\. 大屏 kiosk 常驻模式启动参数：

```Plain Text
chrome.exe --enable-easy-off-store-extension-install -kiosk chrome-extension://<扩展ID>/gallery.html
```

## 新增功能与优化内容

### 缩放与转场优化

升级自适应缩放逻辑，新增多级自动滚动模式；优化幻灯片转场动画，将旧图淡出改为新图淡入，视觉过渡更流畅。

- **scalefit=0**：缩放关闭，完整适配窗口展示整张素材

- **scalefit=1**：半开启自适应，单向滚动即可浏览完整画面

- **scalefit=2**：完全开启自适应，支持单向滚动\+自动往复滚动，可自定义初始位置、滚动方向、刷新率、横竖滚动速率

### 鼠标与键盘交互

- 鼠标左键单击：暂停/继续幻灯片播放

- 键盘左右方向键：切换上一张/下一张素材

- 鼠标滚轮缩放：以鼠标指针为中心精准缩放

- 鼠标移至屏幕边缘自动触发滚动，支持左键拖拽调整图片位置

- 鼠标中键：重置图片缩放比例与偏移位置

- 鼠标右键：关闭自动滚动（仅 kiosk 大屏模式生效）

### 支持媒体格式

- 图片格式：png、bmp、jpeg、jpg、gif、svg、xbm、webp

- 视频格式：webm、mp4；自动适配幻灯片间隔时长，保证视频完整播放

### 快捷键文件分拣功能

- 数字键 0\-9：将当前素材移动至**当前目录**对应数字子文件夹，文件夹不存在则自动创建

- DEL 删除键：将当前素材移动至根目录下 `_TRASH_` 回收站文件夹（仅移动不物理删除）

- 已移动素材缩略图自动置灰、添加删除线标记，幻灯片自动过滤已移动文件，仅遍历有效素材

- 运行依赖：浏览器需支持 File System Access 文件系统 API

### 性能优化升级

- 开启 WebWorker 子线程，异步预解码 2MB 以上大图，彻底解决主线程卡顿问题

- 复用 Canvas 渲染对象池，减少重复创建销毁开销，降低内存占用

- 内置屏幕休眠锁定，防止大屏播放时自动熄屏

### 移动端适配

新增移动端浏览器兼容适配，已在安卓 Kiwi Browser 完整自测可用，移动端自动降级为文件追加模式，适配触屏操作逻辑。

## 项目迭代变更

完成扩展清单升级，从 Manifest V2 迭代至 V3，适配现代浏览器最新运行规范。

## 已知问题与使用限制

1. 图片宽高比接近窗口比例时，自动滚动动画可能出现抖动，可暂停播放或切换素材规避

2. 修改缩放配置后，界面开关状态不会自动刷新，需手动确认生效

3. scalefit=2 自动滚动仅适配 none/fade 转场，其他转场模式会出现坐标错乱

4. 自动滚动存在一定 CPU 开销，可调高 fpsinterval 参数降低负载（参数不可低于屏幕刷新周期）

5. 随机播放模式下，上一张按钮为随机取值，并非真正的后退回溯

6. 动画播放可能出现画面撕裂，需显示器、显卡开启硬件垂直同步优化

7. 加载素材后修改控制面板参数，快捷键仍会触发文件移动，建议加载文件前完成参数配置

8. 继承原版缺陷：无法自动处理移动端拍摄图片的 EXIF 旋转信息

9. 超长帧 GIF 动图会因无法识别完整时长，出现播放截断问题

10. 受浏览器文件权限限制，部分环境无法新建文件夹、移动文件，仅控制台提示无弹窗报错

11. 文件移动后内存句柄不会自动更新，需重新扫描目录刷新数据

12. 回收站目录存在同名文件时移动失败，浏览器 API 不支持自动覆盖/重命名

13. 移动端浏览器无法开启电脑版目录选择，自动降级为多文件追加选择模式

---

## Interface Preview / 界面预览

![UI preview 1](./docs/preview1.jpg)  
![UI preview 2](./docs/preview2.jpg)  
![UI preview 3](./docs/preview3.jpg)  
![UI preview 4](./docs/preview4.jpg)  
![animated preview 1](./docs/animated1.gif)  
![animated preview 2](./docs/animated2.gif)  

---

## License / 开源协议

This project is licensed under the **CC\-BY\-3\.0 Unported License**\.
Please retain original author attribution for any secondary modification and distribution\.

本项目整体遵循 **CC\-BY\-3\.0 知识共享署名3\.0通用协议**，任何二次修改、分发、使用均需保留原作者版权与出处声明。

> （注：部分内容由豆包 AI 生成）
