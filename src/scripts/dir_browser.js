var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp', 'webm', 'mp4', 'avif'];
var videoFormats = ['webm', 'mp4'];
var filecounter = 0;
var g_selectedDirHandle = null;
/**
 * 标记本次唤起input是什么模式：
 * 'folder' = PC webkitdirectory选文件夹（覆盖）
 * 'files' = 移动OS普通多选文件（追加）
 */
var g_inputSelectMode = 'folder';

/**
 * 更新UI选择状态：【界面只显示文件数量，不显示目录名】
 * @param {number} count
 * @param {string|null} dirName 仅用于控制台日志，UI忽略
 */
function updateSelectStatus(count, dirName) {
	const statusEl = document.getElementById('selectStatusText');
	if (!statusEl) return;
	if (count <= 0) {
		statusEl.textContent = "No file chosen";
	} else {
		statusEl.textContent = `${count} file${count>1?'s':''} chosen${!dirName?'':(' in '+dirName)}`;
	}
}
function changeImage(elem, img) {
	$(elem).attr("src", img);
}
function changeBackgroundStyle() {
	var bg_color = localStorage["background_color"];
	if (!bg_color) {
		bg_color = "333333";
	}
	var bg_pattern = localStorage["background_pattern"];
	if (!bg_pattern) {
		bg_pattern = "";
	}
	var newbackground = "";
	if (bg_pattern == "") {
		newbackground = "#" + bg_color;
	}
	else {
		newbackground = "#" + bg_color + " url('css/" + bg_pattern + "') repeat";
	}
	$('body').css('background', newbackground);
}
function update_superbgControls() {
	if (filecounter > 0) {
		changeImage("#control_back", "css/media-seek-backward-3.png");
		changeImage("#control_forward", "css/media-seek-forward-3.png");
		if (false == $.superbg_slideshowActive) {
			changeImage("#control_start", "css/media-playback-start-3_inactive.png");
			changeImage("#control_stop", "css/media-playback-stop-3_inactive.png");
		}
		else {
			changeImage("#control_start", "css/media-playback-start-3.png");
			changeImage("#control_stop", "css/media-playback-stop-3.png");
		}
		if (false == my_slideshowActive) {
			changeImage("#control_pause", "css/media-playback-pause-3_inactive.png");
		}
		else {
			changeImage("#control_pause", "css/media-playback-pause-3.png");
			changeImage("#control_start", "css/media-playback-start-3.png");
			changeImage("#control_stop", "css/media-playback-stop-3.png");
		}
	}
	else {
		changeImage("#control_back", "css/media-seek-backward-3_inactive.png");
		changeImage("#control_forward", "css/media-seek-forward-3_inactive.png");
		changeImage("#control_start", "css/media-playback-start-3_inactive.png");
		changeImage("#control_stop", "css/media-playback-stop-3_inactive.png");
		changeImage("#control_pause", "css/media-playback-pause-3_inactive.png");
	}
}

/**
 * 简单判断是否移动OS 但移动端浏览器选电脑版时伪装为Linux会误判
 * @returns {boolean}
 */
function isMobileOS(){
	const ua = navigator.userAgent.toLowerCase();
	return /android|iphone|ipad|ipod|openharmony/.test(ua);
}

/**
 * changedir 两个入参分支
 * 1. Event对象(input FileList)：行为由 g_inputSelectMode 控制
 *      mode='folder' → PC webkitdirectory选文件夹，覆盖全部列表
 *      mode='files'  → 移动端普通多选，追加到现有列表
 * 2. FileSystemDirectoryHandle(showDirectoryPicker/drop)：永远覆盖全部列表
 */
async function changedir(arg) {
	var output = document.getElementById("thumbs1");
	var parsesubfolder = $("input[name='parsesubfolders']:checked").val() == 'on';

	// --------分支A：来自 input 文件选择 Event--------
	if (arg instanceof Event) {
		var files = arg.target.files;
		if (files.length > 0) {
			$('#thumbs1').stopSlideShow();

			if(g_inputSelectMode === 'folder'){
				// PC选文件夹模式：清空，覆盖原有列表
				output.innerHTML = "<legend1 class='legend1'>Image List</legend1>";
				filecounter = 0;
				$.myFileList = [];
				g_selectedDirHandle = null;
			}else{
				// 移动端追加模式：不清空，只置空目录句柄
				if(g_selectedDirHandle !== null){
					g_selectedDirHandle = null;
				}
			}

			// 循环本次选中全部File
			for (var i = 0, file; file = files[i]; i++) {
				var filename = file.name;
				var type = file.type;
				var webkitpath = file.webkitRelativePath;

				// 子目录路径层级计数
				var subpathcount = webkitpath.split("/").length - 1;
				if (false == parsesubfolder && subpathcount > 1) {
					continue;
				}

				// 提取小写文件后缀名 【修复语法错误的关键行】
				var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();

				// 不在图片/视频格式列表则跳过
				if (imgFormats.indexOf(ext) == -1) {
					continue;
				}
				// 极小损坏文件跳过，不alert
				if (file.size <= 32) {
					continue;
				}
				// 简单去重：文件名+文件大小
				const exists = $.myFileList.some(item=> item.title === filename && item.fileSize === file.size);
				if(exists) continue;

				var fileUrl = window.URL.createObjectURL(file);
				$.myFileList.push({
					href: fileUrl, title: file.name, rel: (filecounter + 1),
					imgType: (videoFormats.indexOf(ext) == -1 ? -1 : 0),
					fileSize: file.size, rawFile: file,
					fileHandle: null, parentDirHandle: null,
					ext: ext, type: type, moved: false
				});
				filecounter++;
			}
			updateSelectStatus(filecounter, null);
		}
	}
	// --------分支B：来自目录句柄 showDirectoryPicker / drop--------
	else if (typeof arg === "object" && arg !== null && arg.kind === "directory") {
		const dirHandle = arg;
		$('#thumbs1').stopSlideShow();
		output.innerHTML = "<legend1 class='legend1'>Image List</legend1>";
		filecounter = 0;
		$.myFileList = [];
		g_selectedDirHandle = dirHandle;
		console.log("[DIR‑SCAN] 开始扫描目录：", dirHandle.name);

		// 递归扫描子目录
		async function scanDirectory(currentDirHandle, relPath) {
			for await (const [name, entry] of currentDirHandle.entries()) {
				if (entry.kind === "directory") {
					if (parsesubfolder) {
						await scanDirectory(entry, relPath + name + "/");
					}
					continue;
				}
				if (entry.kind !== "file") continue;

				var ext = name.substr(name.lastIndexOf('.') + 1).toLowerCase();
				if (imgFormats.indexOf(ext) === -1) continue;

				const file = await entry.getFile();
				if (file.size <= 32) {
					continue;
				}
				const fileUrl = window.URL.createObjectURL(file);
				$.myFileList.push({
					href: fileUrl,
					title: name,
					rel: (filecounter + 1),
					imgType: (videoFormats.indexOf(ext) == -1 ? -1 : 0),
					fileSize: file.size,
					rawFile: file,
					fileHandle: entry,
					parentDirHandle: currentDirHandle,
					ext: ext,
					type: file.type,
					moved: false
				});
				filecounter++;
			}
		}
		await scanDirectory(dirHandle, "");
		console.log("[DIR‑SCAN] 目录扫描完成：", dirHandle.name, "共找到媒体文件：", filecounter);
		updateSelectStatus(filecounter, dirHandle.name);
		$('#fileURL')[0].value = '';
	}

	// --------通用后续UI渲染逻辑，两个分支都会走到这里--------
	output.innerHTML += "<br style='clear:both' />";
	if (filecounter > 0) update_superbgControls();
	$('#thumbs1 a').remove();
	$(".legend1").show().css('display', 'block');
	$('#thumbs1').superbgimage({ reload: true }).css('height', '15px').css('padding', '0px').addClass('hidden').children().hide();
	$(".legend1").show().css('display', 'block');
	$(".legend1").off('click').click(function () {
		var output = document.getElementById("thumbs1");
		if ($(this).parent().hasClass('hidden')) {
			var len = $.myFileList.length;
			if (len > 0) {
				for (var i = 0; i < len; i++) {
					var myFile = $.myFileList[i];
					output.insertAdjacentHTML('beforeend', '<a href="' + myFile.href + '" alt="' + myFile.title + '" title="' + myFile.title
						+ '" fileid="' + i + '" data-imgtype="' + myFile.imgType + '" data-filesize="' + myFile.fileSize + '" ext="' + myFile.ext + '" type="' + myFile.type
						+ '" rel="' + (i + 1) + '" class="' + (myFile.moved ? 'moved' : 'preload') + '">' + (i + 1) + '</a>');
				}
				$('#thumbs1 a').click(function () {
					if ($(this).hasClass('preload'))
						$(this).superbgShowImage($(this).attr('rel'));
					return false;
				});
				$('#thumbs1 a.preload[rel="' + $.superbg_imgActual + '"]').addClass('activeslide');
			}
			$(this).parent().css('height', 'auto').css('padding', '10px').removeClass('hidden').children().show();
			$(this).show().css('display', 'block');
		} else {
			$('#thumbs1 a').remove();
			$(this).parent().css('height', '15px').css('padding', '0px').addClass('hidden').children().hide();
			$(this).show().css('display', 'block');
		}
	});
	if (!$("#overlay").hasClass('hidden')) {
		$("#overlay").css('height', '68px').addClass('hidden').children().hide().end().fadeTo('slow',0.0);
		$("h1").show();
	}
}

var wakeLock = null;
function allowScreenSleep() {
	if (wakeLock != null) {
		try {
			wakeLock.release().then(() => {
				wakeLock = null;
			});
		} catch (err) { }
	}
}
async function keepScreenAwake() {
	if (wakeLock == null) {
		try {
			wakeLock = await navigator.wakeLock.request('screen');
		} catch (err) {
		}
	}
}

$(window).load(function () {
	(function () {
		var input = document.getElementById("fileURL");
		var pickWrapper = document.getElementById("dirPickWrapper");
		var dropZoneElem = document.querySelector(".dropzone");
		changeBackgroundStyle();

		if (pickWrapper) {
			pickWrapper.addEventListener("click", function (ev) {
				ev.preventDefault();
				const mobile = isMobileOS();

				if(mobile){
					input.removeAttribute('webkitdirectory');
					g_inputSelectMode = 'files';
				}else{
					input.setAttribute('webkitdirectory','');
					g_inputSelectMode = 'folder';
				}

				if (typeof window.showDirectoryPicker === "function") {
					(async function(){
						try {
							const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
							console.log("[INPUT‑CLICK‑PICKER] got dirHandle:", dirHandle);
							await changedir(dirHandle);
						} catch (err) {
							if (err.name !== "AbortError") {
								console.error("showDirectoryPicker error:", err);
							}
						}
					})();
				} else {
					console.warn("[FALLBACK] showDirectoryPicker not available, use native file input");
					let fired = false;

					async function onNativeChange(evt){
						if(fired) return;
						fired = true;
						input.removeEventListener("change", onNativeChange);
						input.removeEventListener("input", onNativeChange);
						try {
							await changedir(evt);
						} catch (e) {
							console.error("fallback changedir error:", e);
						}
					}
					input.removeEventListener("change", onNativeChange);
					input.removeEventListener("input", onNativeChange);
					input.addEventListener("change", onNativeChange);
					input.addEventListener("input", onNativeChange);

					input.click();
				}
			});
		}

		if (dropZoneElem) {
			dropZoneElem.addEventListener("dragover", function (e) {
				e.preventDefault();
				if (pickWrapper && pickWrapper.contains(e.target)) {
					pickWrapper.classList.add('drag-hover');
				} else {
					pickWrapper.classList.remove('drag-hover');
				}
			});
			dropZoneElem.addEventListener("dragleave", function () {
				pickWrapper.classList.remove('drag-hover');
			});
			dropZoneElem.addEventListener("drop", async function (e) {
				e.preventDefault();
				pickWrapper.classList.remove('drag-hover');
				const items = [...e.dataTransfer.items];
				const handlePromises = items
					.filter(it => it.kind === 'file')
					.map(it => it.getAsFileSystemHandle());
				const handles = await Promise.all(handlePromises);
				for (const h of handles) {
					if (h && h.kind === "directory") {
						console.log("[DROP‑ZONE] drop folder dirHandle:", h);
						await changedir(h);
						break;
					}
				}
			});
		}

		document.addEventListener("visibilitychange", function () {
			if (document.hidden) {
				allowScreenSleep();
			}
			else {
				keepScreenAwake();
			}
		}, false);
		window.addEventListener("focus", () => {
			keepScreenAwake();
		});
		window.addEventListener("blur", () => {
			allowScreenSleep();
		})
		keepScreenAwake();
	})();
});
