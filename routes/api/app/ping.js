exports = module.exports = function(req, res) {
	res.apiResponse({
		success: true,
		config: {
			versions: { 
				compatibility: '1.0.0',
				production: '1.0.0'
			},
			killSwitch: false // Disables app completely (blocks all user interaction with app)
		}
	});
}
