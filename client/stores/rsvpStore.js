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
	console.log("RSVPStore - loading attendees");
	cancelRefresh();
	request
		.get('/api/react/react')
		.end(function(err, res) {
			if (err) {
				console.log('Error with the AJAX request: ', err)
			}
			if (!err && res.body) {
				refreshTimeout = setTimeout(RSVPStore.refreshAttendees, 2000);
				attendees = res.body.people;
				console.log("======Refreshing attendees======", attendees);
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
					console.log(res.body)
				}
				callback && callback({
					rsvpStatus: { rsvped: true, attending: res.body.attending }
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
