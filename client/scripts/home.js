var React = require('react');
var ReactDOM = require('react-dom');

/** Attendees */

var AttendingApp = require('../components/AttendingApp.js');
var attendingAppTarget = document.getElementById('react-attending');
if (attendingAppTarget) {
	ReactDOM.render(<AttendingApp />, attendingAppTarget);
}

/** Hero (RSVP Button) */

var HeroApp = require('../components/HeroApp.js');
var heroAppTarget = document.getElementById('react-hero-button');
if (heroAppTarget) {
	ReactDOM.render(<HeroApp />, heroAppTarget);
}
