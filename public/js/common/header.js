$(function() {
	$("#header").headroom({
		"tolerance": 30,
		"offset": 0,
		"classes": {
			"initial": "animated",
			"pinned": "slideDown",
			"unpinned": "slideUp",
			"top": "headroom--top",
			"notTop": "headroom--not-top"
		}
	});
});

$(window).bind("load", function() {
	if ($(window).width() > 979) {
		$("#header").addClass('header--fixed animated');
	} else {
		$("#header").removeClass();
	}
});

$(window).resize(function() {
	if ($(window).width() > 979) {
		$("#header").addClass('header--fixed animated');
	} else {
		$("#header").removeClass();
	}
});