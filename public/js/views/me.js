$(function() {
	
	// Only reveal mentoring fields when appropriate
	
	var mentoringFields = $('.mentoring-fields');

	mentoringFields.hide();
	
	$('input[name="mentoring.available"]').change(function() {
		mentoringFields[$(this).prop('checked') ? 'show' : 'hide']();
	});
});
