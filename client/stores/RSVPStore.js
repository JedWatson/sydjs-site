var _ = require('lodash');
var Store = require('store-prototype');
var request = require('superagent');

var RSVPStore = new Store();

var attendees = false;

var REFRESH_INTERVAL = 10000; // 10 seconds

var refreshTimeout = null;
function cancelRefresh() {
	clearTimeout(refreshTimeout);
}

RSVPStore.extend({

	rsvp: function(data, callback) {
		cancelRefresh();
		request
			.post('/api/me/meetup')
			.send({ data: data })
			.end(function(err, res) {
				if (err) {
					console.log('Error with the AJAX request: ', err)
					return;
				}
				if (!err && res.body) {
				}
				callback && callback({
					rsvpStatus: {
						rsvped: true,
						attending: data.attending
					}
				});
				RSVPStore.queueAttendeeRefresh();
			});
	},

	isLoaded: function() {
		return attendees ? true : false;
	},

	loadAttendees: function(callback) {
		// ensure any scheduled refresh is stopped,
		// in case this was called directly
		cancelRefresh();
		// request the update from the API
		request
			.get('/api/meetup')
			.end(function(err, res) {
				if (err) {
					console.log('Error with the AJAX request: ', err)
				}
				if (!err && res.body) {
					attendees = res.body.people;
					RSVPStore.notifyChange();
					return callback && callback(err, res.body)
				}
			});
	},

	queueAttendeeRefresh: function() {
		refreshTimeout = setTimeout(RSVPStore.loadAttendees, REFRESH_INTERVAL);
	}

	getAttendees: function(callback) {
		return attendees;
	}

});

RSVPStore.loadAttendees();

module.exports = RSVPStore;
