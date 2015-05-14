var _ = require('lodash');
var Store = require('store-prototype');
var request = require('superagent');

var AttendingStore = new Store();

var details = getDefaultDetails();

function getDefaultDetails() {
	return {
		'attendees': 100
	}
}

AttendingStore.extend({

	getAttendees: function() {
		return _.clone(details)
	}

	// getAttendees: function(callback) {

	// 	request
	// 		.get('/api/attendees')
	// 		.query({  })
	// 		.end(function(err, res) {
	// 			console.log('something is happening')
	// 			return callback && callback(err, res.body)
	// 		});
	// }

})

module.exports = AttendingStore;
