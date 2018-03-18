afa_zoom = 1.0;
afa_zoom_old = 1.0;
afa_imageload = true;
afa_xA = 0;
afa_yA = 0;
afa_drag = false;
afa_dragX = 0;
afa_dragY = 0;
afa_clickX = 0;
afa_clickY = 0;
afa_borderX = 0;
afa_borderY = 0;
afa_autoleft = false;
afa_autoright = false;
afa_autoup = false;
afa_autodown = false;
afa_notmove = false;

$(function() {

	// Options for SuperBGImage
	$.fn.superbgimage.options = {
		id: 'superbgimage', // id for the containter
		z_index: 0, // z-index for the container
		inlineMode: 0, // 0-resize to browser size, 1-do not resize to browser-size
		showimage: 1, // number of first image to display
		vertical_center: 1, // 0-align top, 1-center vertical
		transition: 1, // 0-none, 1-fade, 2-slide down, 3-slide left, 4-slide top, 5-slide right, 6-blind horizontal, 7-blind vertical, 90-slide right/left, 91-slide top/down
		transitionout: 1, // 0-no transition for previous image, 1-transition for previous image
		randomtransition: 0, // 0-none, 1-use random transition (0-7)
		showtitle: 0, // 0-none, 1-show title
		slideshow: 1, // 0-none, 1-autostart slideshow
		slide_interval: 4000, // interval for the slideshow
		randomimage: 1, // 0-none, 1-random image
		speed: 'slow', // animation speed
		preload: 0, // 0-none, 1-preload images
		onShow: superbgimage_show, // function-callback show image
		onClick: superbgimage_click, // function-callback click image
		onHide: superbgimage_hide, // function-callback hide image
		onMouseenter: superbgimage_mouseenter, // function-callback mouseenter
		onMouseleave: superbgimage_mouseleave, // function-callback mouseleave
		onMousemove: superbgimage_mousemove, // function-callback mousemove
		// onMouseover: superbgimage_mouseover,
		onMousewheel: superbgimage_mousewheel, // 鼠标滚轮
		onMouseup: superbgimage_mouseup,
		onMousedown: superbgimage_mousedown,
		onDragstart: superbgimage_dragstart,
		scaletofit: 2, // 0- no fitting, 1- fit image to view container
		initposition: 0,
		initdirection: 0,
		fpsinterval: 16,
		xspeed: 0.008,
		yspeed: 0.0035
	};

	// initialize SuperBGImage
	$('#thumbs1').superbgimage();

});

var gLastImagePos = 0;

// function callback on hiding image
function superbgimage_hide(img) {
	$('#showtitle').hide();
}


function superbgimage_cleanup(img) {
	//if (console && console.log) console.log("superbgimage_show: " + img + ", last imagepos: " + gLastImagePos);
	$('img[rel]').each(function(index) {
		var aktRelPos = $(this).attr("rel");
		if (aktRelPos != img && aktRelPos != gLastImagePos){
			//if (console && console.log) console.log("image removed: " + aktRelPos );
			$(this).remove();
		}
	});
	$('video[rel]').each(function(index) {
		var aktRelPos = $(this).attr("rel");
		if (aktRelPos != img && aktRelPos != gLastImagePos){
			//if (console && console.log) console.log("image removed: " + aktRelPos );
			$(this).remove();
		}
	});
}

// function callback on showing image
// get title and display it
function superbgimage_show(img) {
	$('#superbgimage').css('background', 'none');
	$('#superbgimage').append($('#showtitle'));
	$('#showtitle p.imagecount').html('image ' + img + ' of ' + $.superbg_imgIndex);
	if ($('#thumbs1').css('display') == 'block') {
		$('#showtitle p.title').html($('#thumbs1 a' + "[rel='" + img + "']").attr('title'));
	} else {
		$('#showtitle p.title').html($('#thumbs2 a' + "[rel='" + img + "']").attr('title'));
	}
	$('#showtitle').fadeIn('fast');
	// save last image pos
	superbgimage_cleanup(img);
	gLastImagePos = img;
}


$(document).keydown(function(e) {
	switch(e.keyCode) {
	// User pressed right arrow
	case 39:	//右
	case 32:	//空格
		return $('#thumbs').nextSlide();
		break;
	// User pressed left arrow
	case 37:	//左
		return $('#thumbs').prevSlide();
		break;
	case 48:	//0
	case 96:
		return $('#thumbs').afa_moveto("0");
		break;
	case 49:	//1
	case 97:
		return $('#thumbs').afa_moveto("1");
		break;
	case 50:	//2
	case 98:
		return $('#thumbs').afa_moveto("2");
		break;
	case 51:	//3
	case 99:
		return $('#thumbs').afa_moveto("3");
		break;
	case 52:	//4
	case 100:
		return $('#thumbs').afa_moveto("4");
		break;
	case 53:	//5
	case 101:
		return $('#thumbs').afa_moveto("5");
		break;
	case 54:	//6
	case 102:
		return $('#thumbs').afa_moveto("6");
		break;
	case 55:	//7
	case 103:
		return $('#thumbs').afa_moveto("7");
		break;
	case 56:	//8
	case 104:
		return $('#thumbs').afa_moveto("8");
		break;
	case 57:	//9
	case 105:
		return $('#thumbs').afa_moveto("9");
		break;
	case 46:	//DEL
		return $('#thumbs').afa_moveto("DEL");
	break;
	}
});

// function callback on clicking image, show next slide
function superbgimage_click(img) {
	// $('#thumbs').nextSlide();
	var e= window.event;
	switch (e.which)
	{
	case 2:	//中键恢复
		e.preventDefault();
		afa_zoom = 1.0;
		afa_zoom_old = 1.0;
		afa_imageload = true;
		var options = $.extend($.fn.superbgimage.defaults, $.fn.superbgimage.options);
		if(options.scaletofit == 2){
			afa_notmove = !afa_notmove;
		}
		drag = false;
		$(this).superbgResize();
	break;
	default:
		afa_drag = false;
		if(afa_dragX!=afa_clickX || afa_dragY!=afa_clickY){
			break;
		}
		//左键暂停
		if ($.superbg_slideshowActive && $.superbg_imgLast > 1) {
			my_slideshowActive = true;
			if ($('#pause').length == 0) { 
				$('body').prepend('<div id="pause"><img src="pause.png" \/><\/div>');
			}
			$('#pause').css('position', 'absolute').css('z-index', 3).show();
			$('#thumbs').stopSlideShow();
			update_superbgControls();
			if (my_slideshowActive && ($('#pause').length > 0)) { 
				$("#pause").css("top",(e.pageY + 20) + "px").css("left",(e.pageX + 20) + "px").show();
			}
			return false;
		}
		else{
			if (my_slideshowActive && ($('#pause').length > 0) && ($('#pause').css('display') == 'block')){
				$('#pause').hide();
				$('#thumbs').startSlideShow();
				my_slideshowActive = false;
				update_superbgControls();
				if (my_slideshowActive && ($('#pause').length > 0)) {
					$("#pause").css("top",(e.pageY + 20) + "px").css("left",(e.pageX + 20) + "px").show();
				}
				return false;
			}
		}
	}
}

my_slideshowActive = false;

// function callback onmouseenter, stop slideshow, show pause-indicator
function superbgimage_mouseenter(img) {

	// stop the pausing, Andreas Meyer 22.10.2013
	return;
	if ($.superbg_slideshowActive) {
		my_slideshowActive = true;
		if ($('#pause').length == 0) { 
			$('body').prepend('<div id="pause"><img src="pause.png" \/><\/div>');
		}
		$('#pause').css('position', 'absolute').css('z-index', 3).show();
		return $('#thumbs').stopSlideShow();
	}
}

// function callback onmouseleave, start slideshow, hide pause-indicator
function superbgimage_mouseleave(img) {
	afa_drag = false;
	// stop the pausing, Andreas Meyer 22.10.2013
	return;
	// if (my_slideshowActive && ($('#pause').length > 0) && ($('#pause').css('display') == 'block'))  { 
		// $('#pause').hide();
		// return $('#thumbs').startSlideShow();
	// }	
}

// function callback onmousemove, show and move pause-indicator
function superbgimage_mousemove(img, e) {
	if (my_slideshowActive && ($('#pause').length > 0)) { 
		var x1= $(window).width() - $("#pause").width();
		var y1= $(window).height() - $("#pause").height();	//这样处理后pause图标不会出现滚动条了
		$("#pause").css("top",((e.pageY + 20)>y1 ? y1: (e.pageY + 20)) + "px").css("left",((e.pageX + 20)>x1 ? x1: (e.pageX + 20)) + "px").show();
	}
	// if (afa_drag)
	{
		$(this).superbgResize();
	}
	afa_borderX = afa_dragX = e.pageX;
	afa_borderY = afa_dragY = e.pageY;
}

// function superbgimage_mouseover(img, e) {
	// if (!afa_drag)
	// {
		// $(this).superbgResize();
	// }
	// afa_dragX = e.pageX;
	// afa_dragY = e.pageY;
// }

function superbgimage_mousewheel(img, e) {
	var ee = e.originalEvent;
	ee.preventDefault();
	// $('.activeslide')
	//afa_zoom += ee.wheelDelta * 0.001;
	if(ee.wheelDelta > 0)
		afa_zoom *= 1.1;
	else
		afa_zoom /= 1.1;
	// if(afa_zoom < 1.0) afa_zoom = 1.0;
	$(this).superbgResize();
}

function superbgimage_mouseup(img, e) {
	// var ee = e.originalEvent;
	afa_drag = false;
	afa_dragX = e.pageX;
	afa_dragY = e.pageY;
}
function superbgimage_mousedown(img, e) {
	if (e.which == 2){
		var ee = e.originalEvent;
		ee.preventDefault();
		// var options = $.extend($.fn.superbgimage.defaults, $.fn.superbgimage.options);
		// if(options.scaletofit == 1){
			// $("input[name='optscaletofit']").prop('checked', false);
			// options.scaletofit = 0;
		// }
		// else{
			// $("input[name='optscaletofit']").prop('checked', true);
			// options.scaletofit = 1;
		// }
		// update_superbgOptions();	未定义？作用域不明
		afa_zoom = 1.0;
		afa_zoom_old = 1.0;
		afa_imageload = true;
		drag = false;
		$(this).superbgResize();
	}
	afa_drag = true;
	afa_clickX = afa_dragX = e.pageX;
	afa_clickY = afa_dragY = e.pageY;
}
function superbgimage_dragstart(img, e) {
	e.preventDefault();
	e.originalEvent.preventDefault();
	afa_drag = true;
}
