var React = require('react/addons');
var request = require('superagent');
var RSVPStore = require('../stores/RSVPStore');

var HeroApp = React.createClass({

	getInitialState: function() {
		return {
			user: SydJS.user,
			isReady: RSVPStore.isLoaded(),
			meetup: RSVPStore.getMeetup(),
			rsvp: RSVPStore.getRSVP()
		};
	},

	componentDidMount: function() {
		RSVPStore.addChangeListener(this.updateStateFromStore);
	},

	componentWillUnmount: function() {
		RSVPStore.removeChangeListener(this.updateStoreFromState);
	},

	updateStateFromStore: function() {
		this.setState({
			isReady: RSVPStore.isLoaded(),
			meetup: RSVPStore.getMeetup(),
			rsvp: RSVPStore.getRSVP()
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

	renderWelcome: function() {
		if (this.state.rsvp.attending) {
			return <h4 className="hero-button-title"><span className = "welcome-message">See you there!</span></h4>
		} else {
			return <h4 className="hero-button-title">Are you coming? <br /> <span className="spots-left">{this.state.meetup.remainingRSVPs}<span className="text-thin"> spots left</span></span><br /></h4>
		}
	},

	renderLoading: function() {
		return (
			<div className="hero-button">
				<div className="alert alert-success mb-0 text-center">loading...</div>
			</div>
		);
	},

	renderSignedIn: function() {
		var attending = this.state.rsvp.attending ?  ' btn-success btn-default active' : null;
		var notAttending = this.state.rsvp.attending ? null : ' btn-danger btn-default active';
		if(this.state.meetup.rsvpsAvailable || this.state.rsvp.rsvped && this.state.rsvp.attending) {
			return (
				<div>
					{this.renderWelcome()}
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
	},

	renderSignedOut: function() {
		if (this.state.meetup.rsvpsAvailable) {
			return (
				<div className="hero-button">
					<a className="btn btn-primary btn-lg btn-block js-auth-trigger">RSVP Now (<span class="text-thin">{this.state.meetup.remainingRSVPs} spots left</span>)</a>
				</div>
			)
		} else {
			return (
				<div className="hero-button">
					<div className="alert alert-success mb-0 text-center">No more tickets...</div>
				</div>
			);
		}
	},

	render: function() {
		if (!this.state.isReady) {
			return this.renderLoading();
		}
		return this.state.user ? this.renderSignedIn() : this.renderSignedOut();
	},
});

module.exports = HeroApp;
