$(function() {
	// Headroom
	// (only applied to desktop)
	// ------------------------------
	if ($(window).width() > 768) {
		$("#header").headroom({
			"tolerance": 20,
			"offset": 0,
			"classes": {
				"pinned": "slideDown",
				"unpinned": "slideUp",
				"top": "headroom--top",
				"notTop": "headroom--not-top"
			}
		});
	}
});