var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp', 'webm', 'mp4', 'avif'];
var videoFormats = ['webm', 'mp4'];
var filecounter = 0;
var g_selectedDirHandle = null;

/**
 * 更新UI选择状态：【界面只显示文件数量，不显示目录名】
 * @param {number} count
 * @param {string|null} dirName 仅用于控制台日志，UI忽略
 */
function updateSelectStatus(count, dirName) {
	const statusEl = document.getElementById('selectStatusText');
	if (!statusEl) return;
	if (!dirName || count <= 0) {
		statusEl.textContent = "No file chosen";
	} else {
		// UI只输出计数，删掉目录名展示
		statusEl.textContent = `${count} file${count>1?'s':''} chosen`;
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
 * changedir 支持两种入参
 * 1. Event对象(FileList降级)
 * 2. FileSystemDirectoryHandle（picker / drop）
 */
async function changedir(arg) {
	var output = document.getElementById("thumbs1");
	var parsesubfolder = $("input[name='parsesubfolders']:checked").val() == 'on';

	if (arg instanceof Event) {
		var files = arg.target.files;
		if (files.length > 0) {
			$('#thumbs1').stopSlideShow();
			output.innerHTML = "<legend1 class='legend1'>Image List</legend1>";
			filecounter = 0;
			$.myFileList = [];
			g_selectedDirHandle = null;

			for (var i = 0, file; file = files[i]; i++) {
				var filename = file.name;
				var type = file.type;
				var webkitpath = file.webkitRelativePath;
				var subpathcount = webkitpath.split("/").length - 1;
				if (false == parsesubfolder && subpathcount > 1) {
					continue;
				}
				var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
				if (imgFormats.indexOf(ext) == -1) {
					continue;
				}
				if (file.size <= 32) {
					alert("LocalGalleryViewerExtension_cmd?" + file.name + "?broken");
					continue;
				}
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
	else if (typeof arg === "object" && arg !== null && arg.kind === "directory") {
		const dirHandle = arg;
		$('#thumbs1').stopSlideShow();
		output.innerHTML = "<legend1 class='legend1'>Image List</legend1>";
		filecounter = 0;
		$.myFileList = [];
		g_selectedDirHandle = dirHandle;

		console.log("[DIR‑SCAN] 开始扫描目录：", dirHandle.name);

		async function scanDirectory(currentDirHandle, relPath) {
			for await (const [name, entry] of currentDirHandle.entries()) {
				if (entry.kind === "directory") {
					if (parsesubfolder) {
						await scanDirectory(entry, relPath + name + "/");
					}
					continue;
				}
				if (entry.kind !== "file") continue;
				const ext = name.substr(name.lastIndexOf('.') + 1).toLowerCase();
				if (imgFormats.indexOf(ext) === -1) continue;

				const file = await entry.getFile();
				if (file.size <= 32) {
					alert("LocalGalleryViewerExtension_cmd?" + file.name + "?broken");
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
	}

	output.innerHTML += "<br style='clear:both' />";
	if (filecounter > 0) update_superbgControls();
	$('#fileURL')[0].value = '';
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
		$("#overlay").css('height', '68px').addClass('hidden').children().hide();
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
			screenLock = await navigator.wakeLock.request('screen');
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

		// =========点击事件：按钮、状态文字均可点击=========
		if (pickWrapper) {
			pickWrapper.addEventListener("click", async function (ev) {
				ev.preventDefault();
				if (window.showDirectoryPicker) {
					try {
						const dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
						console.log("[INPUT‑CLICK‑PICKER] got dirHandle:", dirHandle);
						await changedir(dirHandle);
					} catch (err) {
						if (err.name !== "AbortError") {
							console.error("showDirectoryPicker error:", err);
						}
					}
				} else {
					console.warn("[FALLBACK] browser not support FileSystem Access, use native file input");
					const onNativeChange = async function (evt) {
						try {
							await changedir(evt);
						} catch (e) {
							console.error("fallback changedir error:", e);
						}
					};
					input.addEventListener("change", onNativeChange, { once: true });
					input.click();
				}
			});
		}

		// =========唯一拖拽注册点：dropzone，不做冒泡事件监听、无计数器==========
		if (dropZoneElem) {
			dropZoneElem.addEventListener("dragover", function (e) {
				e.preventDefault(); //开启本容器drop能力
				// 判断当前拖拽目标是否在pickWrapper内，控制高亮
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

		// 屏幕休眠逻辑不变
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

