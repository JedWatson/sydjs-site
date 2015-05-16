var React = require('react/addons');
var request = require('superagent');
var rsvpStore = require('../stores/rsvpStore');

var App = React.createClass({

	getInitialState: function() {
		return {
			attendees: '' 
		};
	},

	componentDidMount: function() {

		var self = this;

		rsvpStore.getAttendees(function(err, result) {
			if (err) {
				console.log('Error happening on the client: ', err);
				return;
			}
			self.setState({
				attendees: result.people
			});
		});

	},

	render: function() {
		var results = this.state.attendees;
		var resultsList;
		if (results) {
			resultsList = results.map(function(person) {
				return <li key={person.id}><a href={person.url}><img width="40" height="40" alt={person.name} className="img-circle" src={person.photo ? person.photo : "/images/avatar.png"} /></a></li>
			});
		}
		return (
			<div>
				<section className="attending">
					<h3 className="heading-with-line">100 people are attending</h3>
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
