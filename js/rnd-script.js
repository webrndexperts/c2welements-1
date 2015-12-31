jQuery(document).ready(function(){
	var hb_url = 'http://dev.htmlblocks.com/';
	var base_url = jQuery(document).find('head').find('base').attr('href'); 

	function createCookie(name,value,days) {
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime()+(days*24*60*60*1000));
	        var expires = "; expires="+date.toGMTString();
	    }
	    else var expires = "";
	    document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}

	jQuery('.slick-slider-4').slick({
		'slidesToShow': 4, 'slidesToScroll': 1, 'autoplay': true, 'arrows': false, 'autoplaySpeed': 1500
	});
	jQuery('.slick-slider-3').slick({
		'slidesToShow': 3, 'slidesToScroll': 1, 'autoplay': true, 'arrows': false, 'autoplaySpeed': 1500
	});

	/*Send view count to hb*/
	setTimeout(function(){ 
		
		

		if( !jQuery('#rnd-page-info-head-div').length ) return;
		
		var x = readCookie('visited_count');
		var page = readCookie('visted_page'+window.location.href);
		if( x && page ) return;

		createCookie('visited_count',1,7);
		createCookie('visted_page'+window.location.href,1,7);

		jQuery.ajax({

			url: hb_url+'SaleFunnelPages/add_view_to_funnel/',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				funnel: jQuery('#rnd-page-info-head-div').attr('data-attr-info')
			},
			success: function( response ){
				if(response.code){
					if( response.redirect_url ){
						var html = '<a href="'+response.redirect_url+'" id="hb-next-page">Next Step</a>';
						jQuery('body').append(html);
						
					}
				}
			}			

		});
	}, 3000);

	
	/*Dialog box create*/
	jQuery(document).on('click', '.open-dialog-block', function(){
		var current = jQuery(this);
		var div = jQuery('<div/>');
		var popup_html = "<div>";
		popup_html += "<div class='fancy-top-header'>";
		popup_html += "<h1>Register Your Spot Now</h1>";
		popup_html += "<p>Just enter your name & email to secure your spot on this webinar...</p>";
		popup_html += "</div>";
		popup_html += "<div class='fancy-middel'>";
		popup_html += "<form action='' type='post' id='webinar-registration-form'>";
		popup_html += "<input type='hidden' name='form_type' value='email responder' id='register_your_name_input'>";
		popup_html += "<p><input type='text' name='your_name' placeholder='Enter Your Name...' id='register_your_name_input' value=''></p>";
		popup_html += "<p><input type='email' name='your_email' placeholder='Enter Your Email...' id='register_your_email_input' value=''></p>";
		popup_html += "<p><a class='btn btn-popup send-request-to-hb'><i class='fa fa-arrow-right'></i>&nbsp;secure your spot now</a></p>";
		popup_html += "</form>";
		popup_html += "<p class='notice'>we will not spam, rent, or sell your information...</p>";
		popup_html += "</div>";
		popup_html += "<div class='fancy-footer'><h2>Act Fast - Webinar Spots Fill Up!</h2></div>";
		popup_html += "</div>";

		div.html(popup_html);

		div.find('.btn').addClass( 'button-'+current.attr('attr-button-color') );
		div.attr( 'id', 'fancy-dailog-open');

		jQuery(document).append(div);

		div.fancybox({
			'padding': 0,
			'width': 720,
			'height': 640,
			'openEffect'  : 'none',
			'closeEffect'  : 'none',
			afterClose: function(){
				div.remove();
			}

		});

		$.fancybox.close()

		div.click();

		return false;

	});

	jQuery('button[type="submit"]').click(function(){
		console.log(jQuery('#rnd-page-info-head-div').length);
		console.log('jhere');
		if( jQuery('#rnd-page-info-head-div').length  ) {
			console.log('in');
			/*Funnel page*/
			var current = jQuery(this);
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

			var flag = false;
			jQuery('input[required]').each(function(){
				var current_input = jQuery(this);
				if( current_input.val() == '' ) {
					alert('Values are required!');
					return false;
				}	
			});

			jQuery('select[required]').each(function(){
				var current_input = jQuery(this);
				if( current_input.val() == '' ) {
					alert('Values are required!');
					return false;
				}	
			});

			
			var postData = current.parents().closest('form').serialize();

			jQuery.ajax({

				url : hb_url+'SaleFunnelPages/add_me/',
				type: 'post',
				cache:true,
				dataType: 'json',
				async: false,
				data : postData + "&funnel="+jQuery('#rnd-page-info-head-div').attr('data-attr-info'),
				success: function(response){
					console.log(response);
					if(response.code == 1) {
						
						if( response.redirect_url )
							window.location = response.redirect_url;
						
						return false;
					}
				}

			});

		} else {

			jQuery('#ajax-status-message').remove();
			var current = jQuery(this);
			var postData = current.closest('form').serialize();
			jQuery.ajax({
				url : hb_url+'App/rnd8591698789_form_data/',
				type : 'post',
				dataType: 'json',
				cache:true,
				async: false,
				data: postData+ "&base_url="+base_url,
				beforeSend: function(){
					current.after('<p id="ajax-status-message"><i class="fa fa-spin fa-spinner"></i>&nbsp;Submitting form</p>');
				},
				success: function(response){
					current.after('<p id="ajax-status-message">Successfully submitted form! Wait while redirecting.</p>');
					if( current.closest('form').find('#redirect_url').val() == '' ){
						window.location = window.location
					} else {
						window.location = current.closest('form').find('#redirect_url').val();
					}
				},
				error: function(  jqXHR, textStatus, errorThrown){
					current.after('<p id="ajax-status-message">'+errorThrown+'</p>');
				}
			});
		}


		return false; 

	});

	jQuery('input[type="submit"]').click(function(){

	});



	jQuery('.counter').each(function(){

		var current = jQuery(this);

		var _delay = current.attr('data-delay');

		var _time = current.attr('data-time');

		if( _delay == "" ) _delay = 10;

		if( _time == "" ) _time = 1000;

		jQuery(this).counterUp({

	        delay: _delay,

	        time: _time

	    });

	});

	if(jQuery('.parallax-window').length){
		jQuery('.parallax-window').parallax();
	}

	jQuery("[data-date]").each(function(){

		jQuery(this).countdown(jQuery(this).attr('data-date'), function(event) {

	     	

	     	var $this = jQuery(this).html(event.strftime(''

			    + '<div class="col-sm-3" align="center"><div><h1>%D</h1><span>days</span></div></div>'

			    + '<div class="col-sm-3" align="center"><div><h1>%H</h1><span>hours</span></div></div>'

			    + '<div class="col-sm-3" align="center"><div><h1>%M</h1><span>minutes</span></div></div>'

			    + '<div class="col-sm-3" align="center"><div><h1>%S</h1><span>seconds</span></div></div>'));

	   		});

	});



});


/*
jQuery(function() {

  	jQuery('.animated').appear();

  	jQuery(document.body).on('appear', '.animated', function(e, $affected) {

    	// this code is executed for each appeared element

    	var current = jQuery(this);

    	if(!current.hasClass('animate-done')){

    		current.addClass(current.attr('data-animate-type'));
    		current.addClass('animate-done');

    	}

    	

  	});



});*/