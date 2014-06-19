$(function() {
	
	// Only reveal mentoring fields when appropriate
	
	var mentoringFields = $('.mentoring-fields'),
		mentoringCheck = $('input[name="mentoring.available"]');

	mentoringCheck.change(function() {
		mentoringFields[$(this).prop('checked') ? 'show' : 'hide']();
	});
	if (!mentoringCheck.prop('checked')) {
		mentoringFields.hide();
	}
});
