var React = require('react/addons');
var AttendingStore = require('../stores/AttendingStore');

var App = React.createClass({

	getInitialState: function() {
		return {
			details: AttendingStore.getAttendees()
		};
	},

	componentDidMount: function() {
		AttendingStore.getAttendees(function(err, result) {
			if (err) {
				console.log('Oi, error right here: ',err)
			}
			console.log('details pls:', details)
		});
	},

	render: function() {
		var details = this.state.details;
		return (
			<div> 
				<section className="attending">
					<h3 className="heading-with-line">{details} people are attending</h3>
					<ul className="list-unstyled list-inline text-center attendees-list">
						<li><img src="/images/avatar.png" className="img-circle"/></li>
					</ul>
				</section>
			</div>
		);
	}

});

React.render(<App />, document.getElementById('react-attending'));

module.exports = App;
