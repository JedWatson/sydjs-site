$(function() {
	
	// Handle attendence
	var $nextMeetup = $('#next-meetup');
	if ($nextMeetup.length) {
		var meetup = $nextMeetup.data();
		
		var $attending = $('.js-rsvp-attending'),
			$decline = $('.js-rsvp-decline'),
			$attendingDuckJs = $('.js-rsvp-duck'),
			$attendingWhiskeyJs = $('.js-rsvp-whiskey');
		
		var toggleRSVP = function(attending,duck,whiskey) {
			console.log(arguments)
			$.ajax({
				url: '/api/me/meetup',
				type: 'POST',
				data: {
					meetup: meetup.id,
					attending: attending,
					attendingDuckJs: duck,
					attendingWhiskeyJs: whiskey
				},
				success : function(data) {
					console.log(data);
				}
			});
		}

		var gatherReq = function() {
			var attending = false,
			attendingDuckJs = false,
			attendingWhiskeyJs = false;
			if($decline.hasClass('btn-danger') !== true) { attending = true; }
			if($attendingDuckJs.hasClass('btn-success')) { attendingDuckJs = true; }
			if($attendingWhiskeyJs.hasClass('btn-success')) { attendingWhiskeyJs = true; }
			return [attending,attendingDuckJs,attendingWhiskeyJs];
		};

		$attending.click(function() {
			$attending.addClass('btn-success').siblings().removeClass('btn-danger');
			toggleRSVP.apply(null,gatherReq());
		});
		
		$decline.click(function() {
			$decline.addClass('btn-danger').siblings().removeClass('btn-success');
			toggleRSVP.apply(null,gatherReq());
		});

		$attendingDuckJs.click(function() {
			if($attendingDuckJs.hasClass('btn-success')) {
				$attendingDuckJs.removeClass('btn-success');
			} else {
				$attendingDuckJs.addClass('btn-success');
			}
			toggleRSVP.apply(null,gatherReq());
		});
		
		$attendingWhiskeyJs.click(function() {
			if($attendingWhiskeyJs.hasClass('btn-success')) {
				$attendingWhiskeyJs.removeClass('btn-success');
			} else {
				$attendingWhiskeyJs.addClass('btn-success');
			}
			toggleRSVP.apply(null,gatherReq());
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
					$('.meetup-alt-toggle').show();
					if (data.rsvped) {
						data.attending ? $attending.addClass('btn-success') : $decline.addClass('btn-danger')
					}
					console.log(data);
					if (data.attendingDuckJs == true) {
						$attendingDuckJs.addClass('btn-success');
					}
					if (data.attendingWhiskeyJs == true) {
						$attendingWhiskeyJs.addClass('btn-success');
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
