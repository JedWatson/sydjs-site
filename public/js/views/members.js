$( function() {
	var $container = $('#members');
	$container.imagesLoaded( function() {
		$container.masonry({ itemSelector: '.member-item' });
	});
	$('.is-tooltip').tooltip();
});