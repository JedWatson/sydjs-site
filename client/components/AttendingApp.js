var React = require('react');
var request = require('superagent');
var RSVPStore = require('../stores/RSVPStore');

var AttendingApp = React.createClass({

	getInitialState: function() {
		return {
			isReady: RSVPStore.isLoaded(),
			attendees: RSVPStore.getAttendees()
		};
	},

	componentDidMount: function() {
		RSVPStore.addChangeListener(this.updateStateFromStore);
	},

	componentWillUnmount: function() {
		RSVPStore.removeChangeListener(this.updateStateFromStore);
	},

	updateStateFromStore: function() {
		this.setState({
			isReady: RSVPStore.isLoaded(),
			attendees: RSVPStore.getAttendees()
		});
	},

	renderHeading: function() {
		if (!this.state.isReady) return <h3 className="heading-with-line">...</h3>;
		var count = this.state.attendees ? this.state.attendees.length : '...';
		var plural = count === 1 ? ' person is' : ' people are';
		return <h3 className="heading-with-line"> {count + plural} attending</h3>;
	},

	render: function() {
		var attendeesList;
		if (this.state.isReady) {
			attendeesList = this.state.attendees.map(function(person) {
				return <li key={person.id}><a href={person.url}><img width="40" height="40" alt={person.name} className="img-circle" src={person.photo ? person.photo : "/images/avatar.png"} /></a></li>
			});
		}
		return (
			<div>
				<section className="attending">
					{this.renderHeading()}
					<ul className="list-unstyled list-inline text-center attendees-list">
						{attendeesList}
					</ul>
				</section>
			</div>
		);
	}

});

module.exports = AttendingApp;
