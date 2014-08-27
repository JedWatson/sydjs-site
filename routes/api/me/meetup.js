var keystone = require('keystone'),
	RSVP = keystone.list('RSVP');

exports = module.exports = function(req, res) {
	
	RSVP.model.findOne()
		.where('who', req.user._id)
		.where('meetup', req.body.meetup)
		.exec(function(err, rsvp) {
		
			if (req.body.statusOnly) {
			
				return res.apiResponse({
					success: true,
					rsvped: rsvp ? true : false,
					attending: rsvp && rsvp.attending ? true : false
				});
				
			} else {
				
				if (rsvp) {
					
					rsvp.set({
						attending: req.body.attending
					}).save(function(err) {
						if (err) return res.apiResponse({ success: false, err: err });
						return res.apiResponse({ success: true });
					});
				
				} else {
				
					new RSVP.model({
						meetup: req.body.meetup,
						who: req.user,
						attending: req.body.attending
					}).save(function(err) {
						if (err) return res.apiResponse({ success: false, err: err });
						return res.apiResponse({ success: true });
					});
				
				}
				
			}
		
		});

}
