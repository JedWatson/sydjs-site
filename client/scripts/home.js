var React = require('react');
var reactDOM = require('react-dom');

/** Attendees */

var AttendingApp = require('../components/AttendingApp.js');
var attendingAppTarget = document.getElementById('react-attending');
if (attendingAppTarget) {
	reactDOM.render(<AttendingApp />, attendingAppTarget);
}

/** Hero (RSVP Button) */

var HeroApp = require('../components/HeroApp.js');
var heroAppTarget = document.getElementById('react-hero-button');
if (heroAppTarget) {
	reactDOM.render(<HeroApp />, heroAppTarget);
}
