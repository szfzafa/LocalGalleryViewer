# LocalGalleryViewer
some personal customizations based on localGalleryViewer Chrome Extension originally by Andreas Meyer
https://chrome.google.com/webstore/detail/localgalleryviewerextensi/opheklanmaieaeneebdohfpbjkhcgilk
引用请保留以上来源出处，请遵从Chrome扩展及原作者保留使用许可，使用后果自负

> 基于 localGalleryViewerExtension 1.4 深度二次修改
> 使用浏览器 File System Access API 直接完成本地文件移动操作
> 仅归档个人自用，无正式许可。

## 使用方法
### 扩展本体
1. 调试：chrome加载已解压扩展，打开gallery.html，control面板选择目录（支持拖拽文件夹）
2. 推荐启动参数（kiosk大屏）
chrome.exe --enable-easy-off-store-extension-install -kiosk chrome-extension:// 扩展 ID/gallery.html

## 新增特性
·缩放模式 scalefit增强：
自动放大图片并自动滚动
- scalefit=0：不勾选；适配视图完整展示整张图
- scalefit=1：半透明勾选；单方向滚动即可浏览全图
- scalefit=2：完全勾选；单方向滚动+自动往复滚动；配套参数：初始位置、初始方向、刷新率、水平/垂直滚动速率
（transition fade由旧图fadeOut改为新图fadeIn）

·图片交互
- 鼠标左键单击：暂停/继续幻灯片
- 键盘 ← →：上一张、下一张
- 鼠标滚轮缩放：以鼠标点为缩放中心
- 鼠标移至屏幕边缘触发滚动；支持左键拖拽图片
- 鼠标中键：重置缩放与位置
- 右键：取消自动滚动（仅kiosk模式下生效）

·媒体格式
支持图片：png、bmp、jpeg、jpg、gif、svg、xbm、webp
支持视频：webm、mp4；幻灯片间隔时长不低于视频本身时长

·本地文件按快捷键分拣（键盘0‑9 / DEL）
0～9：将图片移动到**该图片所在目录下**对应的数字子文件夹；子文件夹不存在会自动创建
DEL：将图片移动到**打开的根目录下 `_TRASH_` 回收站目录；不会物理删除文件
已移动图片缩略图置灰+删除线标记、过滤，上下一张仅遍历有效图片
浏览器版本需支持File Access API

·性能优化
- WebWorker 大图（2MB以上）预解码，减轻主线程卡顿
- canvas对象池复用，减少重复开销
- 防休眠熄屏

## 变更
manifest V2已升至V3

## 已知问题
1. 图片宽高比接近窗口时，自动滚动动画可能会鬼畜抖动；请暂停或切图
2. 修改配置后scalefit状态UI需要手动确认
3. scalefit=2自动滚动仅支持transition `none/fade`，其余转场会坐标错乱
4. 自动滚动存在CPU开销，调高fpsinterval可降低负载
5. 随机模式下上一张图片也是随机，并非后退
6. 垂直同步问题，动画中画面撕裂；需显示器、显卡支持并开启硬件垂直同步
7. 加载文件后控件输入框修改数字，按键仍然会触发文件移动——请在加载文件前修改设置
8. EXIF旋转（多为移动设备拍摄）不会自动处理，继承原版遗留问题
9. gif等动图动画时长超幻灯片间隔时动画会播放不全，因其时长难以获取，幻灯片间隔时间只能保持默认不变
10. FileSystemAccess写权限限制；部分环境无法新建文件夹、移动文件，按键仅控制台警告，无弹窗报错
11. 移动后内存列表不会自动更新parentDirHandle；需要重新扫描目录刷新句柄
12. _TRASH_目录存在同名文件移动会报错，浏览器API不会自动重命名覆盖
