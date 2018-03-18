# LocalGalleryViewer
some personal customizations based on localGalleryViewer Chrome Extension originally by Andreas Meyer
https://chrome.google.com/webstore/detail/localgalleryviewerextensi/opheklanmaieaeneebdohfpbjkhcgilk
引用请保留以上来源出处，请遵从Chrome扩展及原作者保留使用许可，使用后果自负
其实我啥也不会，就是改改js方便自己看图，许可授权什么的都没有，这里只是归档一下代码

在localGalleryViewerExtension 1.4基础上，
新增特性：

·放缩模式scalefit增强：
自动放大图片并自动滚动，这个超好用的，解放双手，方便哪啥……你懂得
scale image to fit选项：
去勾选：scalefit=0 图片自动放缩到不需要移动就能展示全图（竖图显示全部高度，横图显示全部宽度）
灰化：scalefit=1 图片自动放缩到只需要移动一个方向就能浏览全部画面（竖图显示全部宽度，横图显示全部高度）
勾选：scalefit=2 图片自动放缩到只需要移动一个方向就能浏览全部画面，同时自动滚动（竖图显示全部宽度并自动上下滚动，横图显示全部高度并自动左右滚动）

·图片控制：
暂停：单击左键控制幻灯片是暂停还是自动播放
上一个下一个：键盘左右键
滚轮缩放：以鼠标当前坐标为中心缩放图片，滚轮上为放大，滚轮下为缩小
手动滚动：将鼠标移动到屏幕边缘，屏幕会向对应方向滚动；或者也可以按住鼠标左键拖动图片
中键：恢复初始位置和缩放
右键：取消自动滚动，用于查看图片细节（需要设置chrome通过kiosk参数运行才能生效，否则右键还是浏览器默认的右键菜单，例如"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --enable-easy-off-store-extension-install -kiosk chrome-extension://扩展的id/gallery.html）

·更多文件格式：
支持多种图片和视频格式，视频播放时间不低于幻灯时间
扩展名：png（不支持apng动图）, bmp, jpeg, jpg, gif（不支持按动画时间播放）, svg, xbm, webp
视频：webm, mp4（常上那啥站的都知道有好多小视频，其实有的也不小，fapheroes、海通信什么的）

·辅助分类或删除：
一个目录有很多图，有的图需要移走或删除，可以边看边删，需要AutoIt配合
先在图片目录下新建名为0~9或DEL的目录，运行AutoIt脚本，对当前图片按0~9数字键或DEL，该文件会被自动移动到相应子目录下，方便分类处理，已经挪走的图片在列表中会被置灰


使用方法：
插件本体：
安装crx：手动下载crx文件，打开chrome或opera扩展程序管理，将crx文件拖动到浏览器确认安装并启用
本地调试：下载1.4_0目录，用chrome或opera加载已解压的扩展程序，打开插件页面左上角control选择目录
推荐使用chrome最新版本kiosk大屏投影模式，例如：
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --enable-easy-off-store-extension-install -kiosk chrome-extension://扩展的id/gallery.html

AutoIt（可选）：
编译依赖UIAWrappers.au3库，编译运行chrome_alert.au3或自行打包；如果不需要移动或删除图片也无须运行


已知问题：
·图片宽高比接近屏幕，但竖图比屏幕只是略高、横图比屏幕只是略宽，自动滚动会有些鬼畜——暂停或看下一张吧，懒得改
·修改设置后scalefit会自动变为灰化状态——懒得定位改，你自己点一下吧
·scalefit=2时不能手动滚动或拖动——代码改乱了，我都不知道怎么改..
·自动滚动只支持none、fade两种transition，其他transition坐标会错乱——懒得改了
·自动滚动速率不平滑，动画效果会受用户机器性能影响——懒得改了，重写绘图算法太麻烦
·自动滚动有一定的CPU利用率——没办法，目前只能通过增大绘图刷新周期规避
·随机模式下察看上一个图不对——懒得改
·有垂直同步问题，图片滚动时有明显撕裂——软件上似乎无解，只能靠用户硬件设置开启垂直同步
·操作本地文件方法很土，还要依赖AutoIt——这个我真不会做，js貌似出于安全设计不允许删改本地文件，你行你来改吧
·按数字键或DEL会弹窗——目前没做开关控制，请无视
·有时插件会随机挂死——在切换设置时容易遇到，但设置好后一般不会挂
·移动设备拍摄的图片不会自动旋转等——原版有的问题我也不知道咋搞哈
