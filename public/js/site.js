$(function() {

	var $navbarLogo = $('.navbar-logo'),
		$easterEgg = $('#easter-egg'),
		$oldLogo = $('#old-logo');
	
	$navbarLogo.click(function(e) {
	
		e.preventDefault();
		
		$navbarLogo.addClass('clicked');
		
		$easterEgg.show();
		
		var height = $easterEgg.height();
		
		$easterEgg.css({ height: 0 });
		$easterEgg.animate({ height: height }, 400);
		
		$oldLogo.css('opacity', 0);
		
		$.getScript( '/old/libs.js', function() {
			$.getScript( '/old/easteregg.js', function() {
				$oldLogo.animate({ opacity: 1 }, 500);
			});
		});
	
	});

});
