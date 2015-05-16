var React = require('react/addons');
var rsvpStore = require('../stores/rsvpStore');

var HeroApp = React.createClass({

	getInitialState: function() {
		return {
			status: '',
			remainingRSVPs: '',
			rsvpsAvailable: ''
		};
	},

	componentDidMount: function() {
		
		var self = this;

		rsvpStore.getAttendees(function(err, result) {
			if (err) {
				console.log("Error in getting attendees");
				return;
			}
			self.setState({
				// remainingRSVPs: result.meetups.last.remainingRSVPs,
				remainingRSVPs: 100,
				rsvpsAvailable: result.meetups.last.rsvpsAvailable

			})
		})
	},

	handleRSVP: function() {
		console.log(this);
		if (this.attending) {
			console.log("yes")
		} else {
			console.log("no")
		}
	},

	spotsLeft: function() {

		if (this.state.remainingRSVPs > 0) {
			return (
				<div>
					<h4 className="hero-button-title">Are you coming? <br /> <span className="text-thin">{ this.state.remainingRSVPs } spots left</span></h4>
					<div className="hero-button">
						<div id="next-meetup" className="form-row meetup-toggle">
							<div className="col-xs-6">
								<button type="button" className="btn btn-lg btn-block btn-default js-rsvp-attending" onClick={this.handleRSVP.bind({attending: true})}>Yes</button>
							</div>
							<div className="col-xs-6">
								<button type="button" className="btn btn-lg btn-block btn-default js-rsvp-decline" onClick={this.handleRSVP.bind({attending: false})}>No</button>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
					<div className="hero-button">
						<div className="alert alert-success mb-0 text-center">No more tickets...</div>
					</div>
			);
		}
	},

	render: function() { 
		return (
				<div> 
					{this.spotsLeft()}
				</div>
		);
	}
});

React.render(<HeroApp />, document.getElementById('react-hero-button'));
