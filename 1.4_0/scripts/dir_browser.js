
var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp', 'webm', 'mp4'];
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
			if (videoFormats.indexOf(ext) == -1){
				output.insertAdjacentHTML('beforeend', '<a href="' + fileUrl + '" alt="' + file.name + '" title="' + file.name + '" fileid="'+ filecounter + '" isvideo="false" ext="'+ ext +'" type="'+ type +'" >' + (filecounter+1) +'</a>');
			}
			else{
				output.insertAdjacentHTML('beforeend', '<a href="' + fileUrl + '" alt="' + file.name + '" title="' + file.name + '" fileid="'+ filecounter + '" isvideo="true" ext="'+ ext +'" type="'+ type +'" >' + (filecounter+1) +'</a>');
			}
		  
		  filecounter++;
		}
		
		// add: <br style="clear:both"/>
		output.innerHTML += "<br style='clear:both' />";
		if (filecounter > 0) update_superbgControls();
		$('#thumbs1').superbgimage({ reload: true }).show().removeClass('hidden');
	}
	
	// 修复image list不能隐藏
	$(".legend1").click(function() {
		if ($(this).parent().hasClass('hidden')) {
			$(this).parent().css('height', 'auto').css('padding', '10px').removeClass('hidden').children().show();
			$(this).show().css('display', 'block');
		} else {
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
	})();
});