var _ = require('lodash');
var Store = require('store-prototype');
var request = require('superagent');

var rsvpStore = new Store();

var details = getDefaultDetails();

function getDefaultDetails () {
	return {
		'name': '',
	};
}

rsvpStore.extend({

	getAttendees: function(callback) {

		request
			.get('/api/react/react')
			.end(function(err, res) {
				var attendees = res.body;
				if (err) {
					console.log('Error with the AJAX request: ', err)
				}
				if (!err && res.body) {
					rsvpStore.notifyChange();
				}
				return callback && callback(err, res.body)
			});

	}

});

module.exports = rsvpStore;
