$(function() {
	
	// Handle attendence
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
			$attending.addClass('btn-success').siblings().removeClass('btn-danger');
			toggleRSVP(true);
		});
		
		$decline.click(function() {
			$decline.addClass('btn-danger').siblings().removeClass('btn-success');
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
