$(function() {
	// Disable the headroom effect on mobile
	// -------------------------------------

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
	
	$('.js-cancel-confirm').click(function(e) {
		if ( !confirm( $(this).data('confirm') || 'Are you sure? You will lose any changes.') )
			return e.preventDefault();
	});
	$('.js-delete-confirm').click(function(e) {
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
			$attending.addClass('btn-success').closest('.meetup-toggle').find('.js-rsvp-decline').removeClass('btn-danger');
			toggleRSVP(true);
		});
		
		$decline.click(function() {
			$decline.addClass('btn-danger').closest('.meetup-toggle').find('.js-rsvp-attending').removeClass('btn-success');
			toggleRSVP(false);
		});
		
		$.ajax({
			url: '/api/me/meetup',
			type: 'POST',
			data: {
				statusOnly: true,
				meetup: meetup.id
			},
			success: function(data) {
				setTimeout(function() {
					$('.meetup-status').hide();
					$('.meetup-toggle').show();
					if (data.rsvped) {
						data.attending ? $attending.addClass('btn-success') : $decline.addClass('btn-danger')
					}
				}, 250);
			}
		});
	}

});
