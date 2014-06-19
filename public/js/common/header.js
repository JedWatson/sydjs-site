$(function() {
	$("#header").headroom({
		"offset": 46,
		"tolerance": 10,
		"classes": {
			"initial": "animated",
			"pinned": "slideDown",
			"unpinned": "slideUp",
			"top": "headroom--top",
			"notTop": "headroom--not-top"
		}
	});
	$(window).bind("load", function() {
		if ($(window).width() > 979) {
			$("#header").addClass('header--fixed animated');
		} else {
			$("#header").removeClass('header--fixed animated');
		}
	});

	$(window).resize(function() {
		if ($(window).width() > 979) {
			$("#header").addClass('header--fixed animated');
		} else {
			$("#header").removeClass('header--fixed animated');
		}
	});

	$(window).scroll(function() {
		var scroll = $(window).scrollTop();

		if (scroll >= 420) {
			$("#header").removeClass('headroom--not-middle').addClass("headroom--middle");
		} else {
			$("#header").removeClass("headroom--middle").addClass('headroom--not-middle');
		}
	});
});

