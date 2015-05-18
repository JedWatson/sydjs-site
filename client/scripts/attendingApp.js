var React = require('react/addons');
var request = require('superagent');
var RSVPStore = require('../stores/rsvpStore');

var App = React.createClass({

	getInitialState: function() {
		return {
			loaded: RSVPStore.isLoaded(),
			attendees: RSVPStore.getAttendees()
		};
	},

	componentDidMount: function() {
		RSVPStore.addChangeListener(this.updateAttendees);
	},

	updateAttendees: function() {
		console.log("We should be updating attendees", RSVPStore.getAttendees());
		this.setState({
			attendees: RSVPStore.getAttendees()
		});
	},

	render: function() {
		console.log(this.state.attendees)
		var results = this.state.attendees;
		console.log("Results.people", results.people)
		var resultsList;
		if (results) {
			resultsList = results.people.map(function(person) {
				return <li key={person.id}><a href={person.url}><img width="40" height="40" alt={person.name} className="img-circle" src={person.photo ? person.photo : "/images/avatar.png"} /></a></li>
			});
		}
		return (
			<div>
				<section className="attending">
					<h3 className="heading-with-line">{results.length} people are attending</h3>
					<ul className="list-unstyled list-inline text-center attendees-list">
						{resultsList}
					</ul>
				</section>
			</div>
		);
	}

});

React.render(<App />, document.getElementById('react-attending'));

{/* */}
