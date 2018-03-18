$(function() {



	// update superbgimage options
	function update_superbgOptions() {

		// speed
		var newspeed = 0;
		var restart_slideshow = false;
		if ($.superbg_slideshowActive){
			$('#thumbs').stopSlideShow();
			restart_slideshow = true;
		}
		
		if (($("input[name='optspeed']").val() == 'slow') || ($("input[name='optspeed']").val() == 'normal') || ($("input[name='optspeed']").val() == 'fast')) {
			newspeed = $("input[name='optspeed']").val(); 
		} else {
			newspeed = parseInt($("input[name='optspeed']").val(), 10); 
			if (isNaN(newspeed)) {
				newspeed = 'slow';
				$("input[name='optspeed']").val('slow');
			}
		}
		
		// slidshow interval
		var newinterval = parseInt($("input[name='optinterval']").val(), 10); 
		if (isNaN(newinterval)) {
			newinterval = 5000;
			$("input[name='optinterval']").val(newinterval);
		}
		var fpsinterval = parseInt($("input[name='fpsinterval']").val(), 10); 
		if (isNaN(fpsinterval)) {
			fpsinterval = 16;
			$("input[name='fpsinterval']").val(fpsinterval);
		}
		var xspeed = parseFloat($("input[name='xspeed']").val(), 10); 
		if (isNaN(xspeed)) {
			xspeed = 0.008;
			$("input[name='xspeed']").val(xspeed);
		}
		var yspeed = parseFloat($("input[name='yspeed']").val(), 10); 
		if (isNaN(yspeed)) {
			yspeed = 0.0035;
			$("input[name='yspeed']").val(yspeed);
		}
		if ($.superbg_slideshowActive) { // restart slideshow
			clearInterval($.superbg_interval);
			return $('#thumbs').startSlideShow();
		}

		// transition out
		var newtransitionout = 0;
		if ($("input[name='opttransout']:checked").val() == 'on') {
			newtransitionout = 1;
		} else {
			newtransitionout = 0;
		}

		// random transition
		var newrandomtransition = 0;
		if ($("input[name='optrandomtrans']:checked").val() == 'on') {
			newrandomtransition = 1;
		} else {
			newrandomtransition = 0;
		}
		
		// random image
		var newrandomimage = 0;
		if ($("input[name='optrandom']:checked").val() == 'on') {
			newrandomimage = 1;
		} else {
			newrandomimage = 0;
		}

		// onclick-callback
		if ($("input[name='optclick']:checked").val() == 'on') {
			onclickfunc = superbgimage_click;
			$('#superbgimage img').each(function() { // add click-callback to all images
				$(this).unbind('click').click(function(){ superbgimage_click($(this).attr('rel')); });
			});	
		} else {
			onclickfunc = null;
			$('#superbgimage img').each(function() { // remove click-callback from all images
				$(this).unbind('click');
			});	
		}

		// onshow-callback
		/*
		if ($("input[name='optshow']:checked").val() == 'on') {
			onshowfunc = superbgimage_show;
			$('#showtitle').fadeIn('fast');
		} else {
			onshowfunc = null;
			$('#showtitle').hide();
		}
		*/

		// image scaletofit
		var newscaletofit = 0;
		if ($("input[name='optscaletofit']:checked").val() == 'on') {
			newscaletofit = 1;	//勾选后肯定为1
			$("input[name='optscaletofit']").css('opacity',0.5);
		} else {
			newscaletofit = $.fn.superbgimage.options.scaletofit;
			if(newscaletofit >= 2)	//去勾选
			{
				newscaletofit = 0;
				$("input[name='optscaletofit']").prop('checked', false);
				$("input[name='optscaletofit']").css('opacity',1);
			}
			else	//屏蔽去勾选
			{
				newscaletofit += 1;
				$("input[name='optscaletofit']").prop('checked', true);
				$("input[name='optscaletofit']").css('opacity',1);
			}
		}
		
		// update options
		/*
		$.fn.superbgimage.options = { 
			transition: parseInt($("#transition").val(), 10),
			speed: newspeed,
			slide_interval: newinterval,
			transitionout: parseInt(newtransitionout, 10),
			randomtransition: parseInt(newrandomtransition, 10),
			randomimage: parseInt(newrandomimage, 10),
			onClick: onclickfunc,
			onShow: onshowfunc,
			scaletofit: parseInt(newscaletofit, 10)
		};
		*/
		$.fn.superbgimage.options = { 
			transition: parseInt($("#transition").val(), 10),
			speed: newspeed,
			slide_interval: newinterval,
			transitionout: parseInt(newtransitionout, 10),
			randomtransition: parseInt(newrandomtransition, 10),
			randomimage: parseInt(newrandomimage, 10),
			onClick: onclickfunc,
			scaletofit: parseInt(newscaletofit, 10),
			initposition: parseInt($("#initposition").val(), 10),
			initdirection: parseInt($("#initdirection").val(), 10),
			fpsinterval: parseInt($("input[name='fpsinterval']").val(), 10),
			xspeed: parseFloat($("input[name='xspeed']").val(), 10),
			yspeed: parseFloat($("input[name='yspeed']").val(), 10)
		};
		
		if (restart_slideshow){
			$('#thumbs').startSlideShow();
		}
	
	}

	// hide options
	$("#options").css('height','15px').css('padding', '0px').addClass('hidden').children().hide();
	$("#options .legend").show();
	$("#options .legend1").show();
	
	// hide set 2
	$("#thumbs2").hide().addClass('hidden');
	
	// fade overlay with controls, fade container to display titles, changed Andreas Meyer
	if ($("#overlay").hasClass('hidden')) { $('#overlay').fadeTo('slow', 0.00); } else { $('#overlay').fadeTo('slow', 0.75); }
	$('#showtitle').fadeTo('slow', 0.00);
	$('#showtitle').hover(
		function () {
			$(this).fadeTo('fast', 1.00);
		},
		function () {
			$(this).fadeTo('fast', 0.00);
		}
	);
	
	// add hoven fading for overlay, Andreas Meyer
	$('#overlay').hover(
		function () {
			$(this).fadeTo('fast', 0.75);
		},
		function () {
			if ($("#overlay").hasClass('hidden')) { $('#overlay').fadeTo('slow', 0.00); } else { $('#overlay').fadeTo('slow', 0.75); }
			//$(this).fadeTo('fast', 0.01);
		}
	);

	// prev slide
	$('a.prev').click(function() {
		return $('#thumbs').prevSlide();
	});

	// next slide
	$('a.next').click(function() {
		return $('#thumbs').nextSlide();
	});

	// start slideshow
	$('a.start').click(function() {
		update_superbgOptions();
		$('#pause').hide();
		$('#thumbs').startSlideShow();
		update_superbgControls();
		return false;
	});

	// stop slideshow
	$('a.stop').click(function() {
		my_slideshowActive = false;
		$('#pause').hide();
		$('#thumbs').stopSlideShow();
		update_superbgControls();
		return false;
	});

	// pause slideshow
	$('a.pausess').click(function() {
		if ($.superbg_slideshowActive && $.superbg_imgLast > 1) {
			my_slideshowActive = true;
			if ($('#pause').length == 0) { 
				$('body').prepend('<div id="pause"><img src="pause.png" \/><\/div>');
			}
			$('#pause').css('position', 'absolute').css('z-index', 3).show();
			$('#thumbs').stopSlideShow();
			update_superbgControls();
			return false;
		}
		else{
			if (my_slideshowActive && ($('#pause').length > 0) && ($('#pause').css('display') == 'block')){
				$('#pause').hide();
				$('#thumbs').startSlideShow();
				my_slideshowActive = false;
				update_superbgControls();
				return false;
			}
		}
	});
	
	// load image set 1
	$('a.loadset1').click(function(){
		$('#thumbs1').stopSlideShow();
		$('#thumbs2').stopSlideShow();
		my_slideshowActive = false;
		$('#showtitle').hide();
		$('#thumbs2').hide().addClass('hidden');
		$('#thumbs1').superbgimage({ reload: true }).show().removeClass('hidden');
		return false;
	});

	// load image set 2- changend, Andreas Meyer
	/*
	$('a.loadset2').click(function(){
		$('#thumbs1').stopSlideShow();
		$('#thumbs2').stopSlideShow();
		my_slideshowActive = false;
		$('#showtitle').hide();
		$('#thumbs1').hide().addClass('hidden');
		$('#thumbs2').superbgimage({ reload: true }).show().removeClass('hidden');
		return false;
	});	
	*/
	
	// change transition with selectbox
	$("#transition").change(function() {
		update_superbgOptions();
	});	

	// change option speed
	$("input[name='optspeed']").change(function() {
		update_superbgOptions();
	});		
	
	// change option slide_interval
	$("input[name='optinterval']").change(function() {
		update_superbgOptions();
	});		

	// change transition with selectbox
	$("#initposition").change(function() {
		update_superbgOptions();
	});	
	
	// change transition with selectbox
	$("#initdirection").change(function() {
		update_superbgOptions();
	});	
	
	// change option slide_interval
	$("input[name='fpsinterval']").change(function() {
		update_superbgOptions();
	});	
	
	// change option slide_interval
	$("input[name='xspeed']").change(function() {
		update_superbgOptions();
	});	
	
	// change option slide_interval
	$("input[name='yspeed']").change(function() {
		update_superbgOptions();
	});	
	
	// change option transitionout
	$("input[name='opttransout']").click(function() {
		update_superbgOptions();
	});	
	
	// change option randomtransition
	$("input[name='optrandomtrans']").click(function() {
		update_superbgOptions();
	});
	
	// change option randomimage
	$("input[name='optrandom']").click(function() {
		update_superbgOptions();
	});	

	// change option onClick-callback
	$("input[name='optclick']").click(function() {
		update_superbgOptions();
	});	
	
	// change option onShow-callback
	$("input[name='optshow']").click(function() {
		update_superbgOptions();
	});		

	// change option scaletofit
	$("input[name='optscaletofit']").click(function() {
		update_superbgOptions();
		// var bufpos = $.superbg_imgActual;
		// var bufpos_showimage = $.fn.superbgimage.options.showimage;
		// var restart_slideshow = false;
		// if ($.superbg_slideshowActive){
			// $('#thumbs').stopSlideShow();
			// restart_slideshow = true;
		// }
			//// my_slideshowActive = false;
		// $('#showtitle').hide();
		// $.fn.superbgimage.options.showimage = bufpos;
		// $('#thumbs1').superbgimage({ reload: true }).show().removeClass('hidden');
		// $.fn.superbgimage.options.showimage = bufpos_showimage;
		// if (restart_slideshow){
			// $('#thumbs').startSlideShow();
		// }
			//// update_superbgControls();
		afa_zoom = 1.0;
		afa_zoom_old = 1.0;
		afa_imageload = true;
		$(this).superbgResize();
	});		
	
	// toggle fieldsets
	$(".legend").click(function() {
		if ($(this).parent().hasClass('hidden')) {
			$(this).parent().css('height', 'auto').css('padding', '10px').removeClass('hidden').children().show();
			$(this).show().css('display', 'block');
		} else {
			$(this).parent().css('height','15px').css('padding', '0px').addClass('hidden').children().hide();
			$(this).show().css('display', 'block');
		}
	});	

	// toggle overlay
	$("h1 a").click(function() {
		$(this).blur();
		if ($("#overlay").hasClass('hidden')) {
			$("#overlay").css('height','auto').removeClass('hidden').children().show();
			// if ($('#thumbs1').hasClass('hidden')) {
				// $('#thumbs1').hide();
			// }
			if ($('#thumbs2').hasClass('hidden')) {
				$('#thumbs2').hide();
			}
		} else {
			$("#overlay").css('height','68px').addClass('hidden').children().hide();
			$("h1").show();
		}
		return false;
	});	
	
});