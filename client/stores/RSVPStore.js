var _ = require('lodash');
var Store = require('store-prototype');
var request = require('superagent');

var RSVPStore = new Store();

var loaded = false;
var meetup = {};
var rsvp = {};
var attendees = [];

var REFRESH_INTERVAL = 10000; // 10 seconds

var refreshTimeout = null;
function cancelRefresh() {
	clearTimeout(refreshTimeout);
}

RSVPStore.extend({

	getMeetup: function() {
		return meetup;
	},

	getRSVP: function() {
		return rsvp;
	},

	getAttendees: function(callback) {
		return attendees;
	},

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
				RSVPStore.queueMeetupRefresh();
			});
	},

	isLoaded: function() {
		return loaded ? true : false;
	},

	getMeetupData: function(callback) {
		// ensure any scheduled refresh is stopped,
		// in case this was called directly
		cancelRefresh();
		// request the update from the API
		request
			.get('/api/meetup/' + SydJS.currentMeetupId)
			.end(function(err, res) {
				if (err) {
					console.log('Error with the AJAX request: ', err)
				}
				if (!err && res.body) {
					loaded = true;
					meetup = res.body.meetup;
					rsvp = res.body.rsvp;
					attendees = res.body.attendees;
					RSVPStore.notifyChange();
				}
				return callback && callback(err, res.body);
			});
	},

	queueMeetupRefresh: function() {
		refreshTimeout = setTimeout(RSVPStore.getMeetupData, REFRESH_INTERVAL);
	}

});

RSVPStore.getMeetupData();
module.exports = RSVPStore;
