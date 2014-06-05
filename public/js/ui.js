$(function() {

	// Nav
	// ------------------------------
	
	if ($(window).width() < 768) {

		var mobileNavWidth = 0,
			mobileNav = $('.navbar-nav');

		mobileNav.find('li').each(function() { mobileNavWidth += $(this).width(); });
		mobileNav.width( mobileNavWidth + 10 );

		$('.site-nav').append('<span class="mask mask-left"></span><span class="mask mask-right"></span>');

	} 
	// console.log(mobileNavWidth);
	
	
	
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

});
