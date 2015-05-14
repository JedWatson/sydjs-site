var React = require('react/addons');
var request = require('superagent');

var App = React.createClass({

	getInitialState: function() {
		return {
			attendees: '' 
		};
	},

	componentDidMount: function() {
		request
			.get('/api/react/react')
			.end(function(err, res) {
				var attendees = res.body;
				if (err) {
					console.log('Errored out man: ', err)
				}

				if (!err && this.isMounted()) {
					this.setState({
						attendees: attendees.persons
					})
				}
			}.bind(this));
	},

	render: function() {
		var results = this.state.attendees;
		var resultsList;
		console.log('is this what we see: ', results);
		if (results) {
			resultsList = results.map(function(person) {
				console.log(person);
				return <li key={person.id}><img width="40" height="40" alt={person.name} className="img-circle" src={person.who && person.who.photo && person.who.photo.url ? person.who.photo.url : "/images/avatar.png"} /></li>
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

module.exports = App;


{/* */}
