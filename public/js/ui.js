$(function() {

	$('.dismiss-alert').click(function () {
		$('#app-alert').hide();
		$.cookie('dismissAppBanner', true);
	});

	if (!$.cookie('dismissAppBanner')) {
		$('#app-alert').removeClass('hidden-md hidden-lg');
	}



	// Nav
	// ------------------------------
	$('#site-nav-toggle').click(function () {
		$(this).toggleClass('open');
		$('#site-nav').toggleClass('open');
		$('body').toggleClass('no-touch-scrolling');

		// Disable hardware scrolling on mobile
		if ($('body').is('.no-touch-scrolling')) {
			document.ontouchmove = function(e){ e.preventDefault(); }
		} else {
			document.ontouchmove = function(e){ return true; }
		};
	});
	
	
	
	
	
	// Generic confirms
	// ------------------------------
	
	$('.js-confirm').click(function(e) {
		if ( !confirm( $(this).data('confirm') || 'Are you sure? This cannot be undone.') )
			return e.preventDefault();
	});
	

	
	
	// UI Reveal
	// ------------------------------
	
	$('.ui-reveal__trigger').click( function() {
		container = $(this).closest('.ui-reveal');
		
		container.addClass('is-revealed');
		
		//- click ensures browse is envoked on file fields 
		container.find('input[type!=hidden],textarea').eq(0).click().focus();
	});
	
	$('.ui-reveal__hide').click( function() {
		container = $(this).closest('.ui-reveal');
		
		container.removeClass('is-revealed');
	});
	
	
	
	// Signin / Join Modal
	// ------------------------------
	
	// init
	var $authmodal = $('#modal-auth');
	var authmodalPanes = $authmodal.find('.auth-box');
	
	// start on the right pane
	// defaults to "join"
	// options "signin" | "join" | "password"
	$("[href='#modal-auth'], [data-modal='auth'], .js-auth-trigger").click( function(e) {
		
		e.preventDefault();
		
		var initial = $(this).data("initial") || 'join';
		var initialPane = $authmodal.find('.modal-pane-' + initial);
		var from = $(this).data("from");
		
		$authmodal.modal('show');
		
		authmodalPanes.addClass('hidden');
		initialPane.removeClass('hidden');
		
		// only focus the first field on large devices where showing
		// the keyboard isn't a jarring experience
		if ($(window).width() >= 768) {
			initialPane.find('input[type!=hidden],textarea').eq(0).click().focus();
		}
		
		if (from) {
			$authmodal.find('[name="from"]').val(from);
		}
	});
	
	// move between panes
	$("[rel='modal-pane']").click( function() {
		
		var switchTo = $authmodal.find('.modal-pane-' + $(this).data("modal-pane"));
		
		authmodalPanes.addClass('hidden');
		switchTo.removeClass('hidden');
		
		
		// only focus the first field on large devices where showing
		// the keyboard isn't a jarring experience
		if ($(window).width() >= 768) {
			switchTo.find('input[type!=hidden],textarea').eq(0).click().focus();
		}
		
	});
	
	
	
	// Handle attendence
	// ------------------------------
	
	var $nextMeetup = $('#next-meetup');
	if ($nextMeetup.length) {
		
		if (!$('.meetup-toggle').length) return;
		
		var meetup = $nextMeetup.data();
		
		var $attending = $('.js-rsvp-attending'),
			$decline = $('.js-rsvp-decline');
		
		var toggleRSVP = function(attending) {
			$.ajax({
				url: '/api/me/meetup',
				type: 'POST',
				data: {
					meetup: meetup.id,
					attending: attending
				}
			});
		}
		
		$attending.click(function() {
			$attending.addClass('btn-success').closest('.meetup-toggle')
				.find('.js-rsvp-decline')
				.removeClass('btn-danger')
				.removeClass('active')
				.addClass('btn-default');
			if (!$attending.hasClass('active')) {
				$attending.addClass('active');
				toggleRSVP(true);
			}
		});
		
		$decline.click(function() {
			$decline.addClass('btn-danger').closest('.meetup-toggle')
				.find('.js-rsvp-attending')
				.removeClass('btn-success')
				.removeClass('active')
				.addClass('btn-default');
			if (!$decline.hasClass('active')) {
				$decline.addClass('active');
				toggleRSVP(false);
			}
		});
		
		$.ajax({
			url: '/api/me/meetup',
			type: 'POST',
			data: {
				statusOnly: true,
				meetup: meetup.id
			},
			success: function(data) {
				if (data.rsvped) {
					data.attending ? $attending.addClass('btn-success active') : $decline.addClass('btn-danger active')
				} else {
					$attending.addClass('btn-success');
					$decline.addClass('btn-danger');
				}
			}
		});
	}
	
	// Clean up URL if signed in via Facebook, see - https://github.com/jaredhanson/passport-facebook/issues/12
	if (window.location.hash && window.location.hash === "#_=_") {
		
		if (window.history && history.pushState) {
			window.history.pushState("", document.title, window.location.pathname);
		} else {
			var scroll = {
				top: document.body.scrollTop,
				left: document.body.scrollLeft
			};
			window.location.hash = "";
			document.body.scrollTop = scroll.top;
			document.body.scrollLeft = scroll.left;
		}
	}

});
