
var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp', 'webm', 'mp4', 'avif'];
var videoFormats = ['webm', 'mp4'];
var filecounter = 0;

function changeImage(elem,img){
	$(elem).attr("src", img);
}


function changeBackgroundStyle(){

  
  var bg_color = localStorage["background_color"];
  if (!bg_color) {
	bg_color = "333333";
  }
  var bg_pattern = localStorage["background_pattern"];
  if (!bg_pattern) {
	bg_pattern = "";
  }
  
  //var bodyarea = document.getElementById("previewarea");
  // build update string
  var newbackground = "";
  if (bg_pattern == ""){
	newbackground = "#" + bg_color;
  }
  else{
	newbackground = "#" + bg_color + " url('css/" + bg_pattern + "') repeat";
  }
  //bodyarea.style.background = newbackground;
  $('body').css('background',newbackground);
}

function update_superbgControls() {
	if (filecounter > 0){
		changeImage("#control_back","css/media-seek-backward-3.png");
		changeImage("#control_forward","css/media-seek-forward-3.png");
		if (false == $.superbg_slideshowActive){
			changeImage("#control_start","css/media-playback-start-3_inactive.png");
			changeImage("#control_stop","css/media-playback-stop-3_inactive.png");
		}
		else{
			changeImage("#control_start","css/media-playback-start-3.png");
			changeImage("#control_stop","css/media-playback-stop-3.png");
		}
		if (false == my_slideshowActive){
			changeImage("#control_pause","css/media-playback-pause-3_inactive.png");
		}
		else{
			changeImage("#control_pause","css/media-playback-pause-3.png");
			changeImage("#control_start","css/media-playback-start-3.png");
			changeImage("#control_stop","css/media-playback-stop-3.png");
		}
	}
	else{
		changeImage("#control_back","css/media-seek-backward-3_inactive.png");
		changeImage("#control_forward","css/media-seek-forward-3_inactive.png");
		changeImage("#control_start","css/media-playback-start-3_inactive.png");
		changeImage("#control_stop","css/media-playback-stop-3_inactive.png");
		changeImage("#control_pause","css/media-playback-pause-3_inactive.png");
	}
}

function changedir(e) {
	var output = document.getElementById("thumbs1");
	var files = e.target.files;
	
	var parsesubfolder = $("input[name='parsesubfolders']:checked").val() == 'on';
	
	
	if (files.length > 0){
		$('#thumbs1').stopSlideShow();
		output.innerHTML = "<legend1 class='legend1'>Image List</legend1>";
		filecounter = 0;
		
		$.myFileList = [];
		for (var i = 0, file; file = files[i]; i++) {
		  //var imageType = /image.*/;
		  //if (!file.type.match(imageType)) {
		  var filename = file.name;
		  var type = file.type;
		  var webkitpath = file.webkitRelativePath;
		  var subpathcount = webkitpath.split("/").length - 1;
		  //if (console && console.log) console.log("file: " + webkitpath + ", subpathcount: " + subpathcount);
		  if (false == parsesubfolder && subpathcount > 1){
			continue;
		  }
		  
		  
		  var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
		  if (imgFormats.indexOf(ext) == -1){
			continue;	//不再支持范围内，跳过
		  }	//在支持范围内，继续
		  if (file.size <= 32){	//空文件
				alert("LocalGalleryViewerExtension_cmd?"+ file.name +"?broken");
				continue;
		  }
		  // window.URL.createObjectURL()
		  var fileUrl = window.URL.createObjectURL(file);
		  //output.insertAdjacentHTML('beforeend', '<a href="' + fileUrl + '" alt="' + file.name + '" title="' + file.name + '" fileid="'+ filecounter +'" >' + (filecounter+1) +'</a>');
			if (videoFormats.indexOf(ext) == -1){	//	图片
				// output.insertAdjacentHTML('beforeend', '<a href="' + fileUrl + '" alt="' + file.name + '" title="' + file.name + '" fileid="'+ filecounter + '" isvideo="false" ext="'+ ext +'" type="'+ type +'" >' + (filecounter+1) +'</a>');
				$.myFileList.push({href:fileUrl, title:file.name, rel:(filecounter+1), isvideo:false, ext:ext, type:type, moved:false});
			}
			else{	//	视频
				// output.insertAdjacentHTML('beforeend', '<a href="' + fileUrl + '" alt="' + file.name + '" title="' + file.name + '" fileid="'+ filecounter + '" isvideo="true" ext="'+ ext +'" type="'+ type +'" >' + (filecounter+1) +'</a>');
				$.myFileList.push({href:fileUrl, title:file.name, rel:(filecounter+1), isvideo:true, ext:ext, type:type, moved:false});
			}
		  
		  filecounter++;
		}
		
		// add: <br style="clear:both"/>
		output.innerHTML += "<br style='clear:both' />";
		if (filecounter > 0) update_superbgControls();
		$('#fileURL')[0].value = '';	//	释放FileList大数组内存
		$('#thumbs1 a').remove();
		//$(this).parent().css('height','15px').css('padding', '0px').addClass('hidden').children().hide();
		$(".legend1").show().css('display', 'block');
		//$('#thumbs1').superbgimage({ reload: true }).show().removeClass('hidden');
		$('#thumbs1').superbgimage({ reload: true }).css('height','15px').css('padding', '0px').addClass('hidden').children().hide();
		$(".legend1").show().css('display', 'block');
	}
	
	// 修复image list不能隐藏
	$(".legend1").click(function() {
		var output = document.getElementById("thumbs1");
		if ($(this).parent().hasClass('hidden')) {
			var len = $.myFileList.length;
			if(len > 0){
				for(var i=0; i<len; i++){
					var myFile = $.myFileList[i];
					output.insertAdjacentHTML('beforeend', '<a href="' + myFile.href + '" alt="' + myFile.title + '" title="' + myFile.title 
					+ '" fileid="'+ i + '" isvideo="' + (videoFormats.indexOf(myFile.ext) >= 0) + '" ext="'+ myFile.ext +'" type="'+ myFile.type
					+'" + rel="' + (i+1) + '" class="' + (myFile.moved ? 'moved':'preload') + '">' + (i+1) +'</a>');
				}
				$('#thumbs1 a').click(function() {	//	给链接添加点击逻辑，superbg_imgIndex从1开始
					//$(this).superbgShowImage();		//	img参数undefined，这可不行，$(this)[0]为a
					if($(this).hasClass('preload'))
						$(this).superbgShowImage($(this).attr('rel'));
					return false;
				});	//.addClass('preload');
				$('#thumbs1 a.preload[rel="' + $.superbg_imgActual + '"]').addClass('activeslide');
			}
			
			$(this).parent().css('height', 'auto').css('padding', '10px').removeClass('hidden').children().show();
			$(this).show().css('display', 'block');
		} else {
			$('#thumbs1 a').remove();
			$(this).parent().css('height','15px').css('padding', '0px').addClass('hidden').children().hide();
			$(this).show().css('display', 'block');
		}
	});	
	
	// 载入后立刻隐藏
	if (!$("#overlay").hasClass('hidden'))
	{
		$("#overlay").css('height','68px').addClass('hidden').children().hide();
		$("h1").show();
	}
}
		
var wakeLock = null;
function allowScreenSleep(){
	if(wakeLock != null){
		try {
			wakeLock.release().then(() => {
				wakeLock = null;
				//	console.log("document is " + document.visibilityState + ", release wakeLock.");
			});
		} catch(err) {}
	}
}

async function keepScreenAwake(){
	/* async () => {
		try {
			if(wakeLock == null){
				//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Bad_await
				//	wakeLock = await navigator.wakeLock.request("screen");
				
				statusElem.textContent = "Wake Lock is active!";
				console.log("document is " + document.visibilityState + ", request wakeLock.");
			}
		} catch (err) {
		// The Wake Lock request has failed - usually system related, such as battery.
			statusElem.textContent = `${err.name}, ${err.message}`;
		}
	} */
	//	https://medium.com/js-bytes/how-to-keep-your-screen-awake-using-javascript-aa15775d9bff
	if(wakeLock == null){
		try {
			// navigator.wakeLock.request('screen')
			// .then(lock => { 
				// wakeLock = lock;
					//	console.log("document is " + document.visibilityState + ", request wakeLock.");
			// });
			try {
				screenLock = await navigator.wakeLock.request('screen');
			} catch(err) {
				//console.log(err.name, err.message);
			}
		} catch(err) {}
	}
}

$(window).load(function(){
	(function(){
		// var files, 
			// file, 
			// extension,
			// input = document.getElementById("fileURL"), 
			// output = document.getElementById("thumbs1");
			
		var input = document.getElementById("fileURL");
		// update background
		changeBackgroundStyle();
		
		input.addEventListener("change", changedir, false);
		
		//TO DO:
		//支持打开后默认加载文件，路径从URL解析，但涉及安全问题，单纯靠js搞不定
		//解决方案：HttpUploaderSingleMgr
		//http://bbs.csdn.net/topics/390002336
		//http://www.cnblogs.com/xproer/archive/2010/10/24/1859895.html
		//但是这个需要ActiveX配合，比较麻烦
		//http://support.myvisionexpress.com/index.php?/Knowledgebase/Article/View/444/0/how-to-activate-activex-for-google-chrome--firefox-for-single-sign-on-feature-for-rd-web-access
		
		//	防熄屏
		//	https://stackoverflow.com/questions/10328665/how-to-detect-browser-minimized-and-maximized-state-in-javascript
		//	https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
		document.addEventListener("visibilitychange", function() {
			//console.log(document.hidden, document.visibilityState);
			if(document.hidden){
				allowScreenSleep();
			}
			else{
				keepScreenAwake();
			}
		}, false);
		//	https://newsn.net/say/js-visibility-change.html
		window.addEventListener("focus", () => {
			//	console.log("focus2");
			keepScreenAwake();
		});
		window.addEventListener("blur", () => {
			//	console.log("blur2");
			allowScreenSleep();
		})
		keepScreenAwake();
	})();
});