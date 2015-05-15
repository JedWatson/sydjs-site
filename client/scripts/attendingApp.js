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
						attendees: attendees.people
					})
				}
			}.bind(this));
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

module.exports = App;


{/* */}
