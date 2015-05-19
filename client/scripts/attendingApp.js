var React = require('react/addons');
var request = require('superagent');
var RSVPStore = require('../stores/rsvpStore');

var App = React.createClass({

	getInitialState: function() {
		console.log("AttendingApp - getInitialState")
		return {
			loaded: RSVPStore.isLoaded(),
			attendees: RSVPStore.getAttendees()
		};
	},

	componentDidMount: function() {
		RSVPStore.addChangeListener(this.updateAttendees);
	},

	updateAttendees: function() {
			this.setState({
				attendees: RSVPStore.getAttendees()
			});
	},
	renderHeading: function() {
		if (!this.state.attendees) return <h3 className="heading-with-line">...</h3>;
		var count = this.state.attendees ? this.state.attendees.length : '...';
		var plural = count === 1 ? ' person is' : ' people are';
		return <h3 className="heading-with-line"> {count + plural} attending</h3>;
	},

	render: function() {
		var results = this.state.attendees;
		console.log("++++++Here are the results+++++",results.length)
		var numberAttending = results.length
		var resultsList;
		if (results) {
			resultsList = results.map(function(person) {
				return <li key={person.id}><a href={person.url}><img width="40" height="40" alt={person.name} className="img-circle" src={person.photo ? person.photo : "/images/avatar.png"} /></a></li>
			});
		}
		return (
			<div>
				<section className="attending">
					{this.renderHeading()}
					{<ul className="list-unstyled list-inline text-center attendees-list">
						{resultsList}
					</ul>}
				</section>
			</div>
		);
	}

});

React.render(<App />, document.getElementById('react-attending'));

{/* */}
