var React = require('react/addons');
var request = require('superagent');
var RSVPStore = require('../stores/rsvpStore');

var HeroApp = React.createClass({

	getInitialState: function() {
		console.log("HeroApp - getInitialState")
		return {
			meetup: Keystone.meetup,
			user: Keystone.user,
			rsvpStatus: Keystone.rsvpStatus,
			attendees: false
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

	sendRSVP: function(attending) {
		var self = this;
		RSVPStore.rsvp({
			meetup: this.state.meetup._id,
			attending: attending
		}, function(data) {
			self.setState(data);
		});
	},

	welcomeMessage: function() {
		if (this.state.rsvpStatus.attending) {
			return <h4 className="hero-button-title"><span className = "welcome-message">See you there!</span></h4>
		} else {
			return <h4 className="hero-button-title">Are you coming? <br /> <span className="spots-left">{this.state.meetup.remainingRSVPs - this.state.attendees.length}<span className="text-thin"> spots left</span></span><br /></h4>
		}
	},

	render: function() {
		var attendees =  this.state.attendees
		if (this.state.user) {
			var attending = this.state.rsvpStatus.attending ?  ' btn-success btn-default active' : null
			var notAttending = this.state.rsvpStatus.attending ? null : ' btn-danger btn-default active'
			if(this.state.meetup.rsvpsAvailable || this.state.rsvpStatus.rsvped && this.state.rsvpStatus.attending) {
				return (
					<div>
						{this.welcomeMessage()}
						<div className="hero-button">
							<div id="next-meetup" data-id={this.state.meetup._id} className="form-row meetup-toggle">
								<div className="col-xs-6">
									<button type="button" onClick={this.sendRSVP.bind(this, true)} className={"btn btn-lg btn-block btn-default js-rsvp-attending" + attending}>Yes</button>
								</div>
								<div className="col-xs-6">
									<button type="button" onClick={this.sendRSVP.bind(this, false)} className={"btn btn-lg btn-block btn-default js-rsvp-decline" + notAttending}>No</button>
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
		} else {
			if (this.state.meetup.rsvpsAvailable) {
				return (
					<div className="hero-button">
						<a className="btn btn-primary btn-lg btn-block js-auth-trigger">RSVP Now {this.state.meetup.remainingRSVPs} spots left<span class="text-thin"></span></a>
					</div>
				)
			} else {
				 return (
					<div className="hero-button">
						<div className="alert alert-success mb-0 text-center">No more tickets...</div>
					</div>
				);
			}
		}
	},
});

React.render(<HeroApp />, document.getElementById('react-hero-button'));
