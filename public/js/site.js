$(function() {

	var $navbarLogo = $('.navbar-logo'),
		$easterEgg = $('#easter-egg'),
		$oldLogo = $('#old-logo');
	
	var hasOpened = false;
	
	$navbarLogo.click(function(e) {
		
		e.preventDefault();
		
		if ($navbarLogo.hasClass('clicked')) {
			
			$navbarLogo.removeClass('clicked');
			
			$easterEgg.animate({ height: 0 }, 400, function() {
				$easterEgg.hide();
				$easterEgg.css({ height: 'auto' });
			});
			
			
		} else {
			
			$navbarLogo.addClass('clicked');
			
			$easterEgg.show();
			
			var height = $easterEgg.height();
			
			$easterEgg.css({ height: 0 });
			$easterEgg.animate({ height: height }, 400);
			
			$oldLogo.css('opacity', 0);
			
			if (!hasOpened) {
				hasOpened = true;
				$.getScript( '/old/libs.js', function() {
					$.getScript( '/old/easteregg.js', function() {
						$oldLogo.animate({ opacity: 1 }, 500);
					});
				});
				
			} else {
				$oldLogo.animate({ opacity: 1 }, 500);
			}
			
		}
	
	});

});
