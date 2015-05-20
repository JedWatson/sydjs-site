var _ = require('lodash');
var Store = require('store-prototype');
var request = require('superagent');

var RSVPStore = new Store();

var attendees = false;
var refreshTimeout = null;

function cancelRefresh() {
	clearTimeout(refreshTimeout);
}

function loadAttendees(callback) {
	cancelRefresh();
	request
		.get('/api/activeMeetup')
		.end(function(err, res) {
			if (err) {
				console.log('Error with the AJAX request: ', err)
			}
			if (!err && res.body) {
				refreshTimeout = setTimeout(RSVPStore.refreshAttendees, 2000);
				attendees = res.body.people;
				RSVPStore.notifyChange();
				return callback && callback(err, res.body)
			}
		});
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
				loadAttendees();
			});
	},

	isLoaded: function() {
		return attendees ? true : false;
	},

	refreshAttendees: function(callback) {
		loadAttendees(callback);
	},

	getAttendees: function(callback) {
		return attendees;
	}

});

loadAttendees();

module.exports = RSVPStore;
