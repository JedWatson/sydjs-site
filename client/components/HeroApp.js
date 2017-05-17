var React = require('react');
var request = require('superagent');
var RSVPStore = require('../stores/RSVPStore');

var HeroApp = React.createClass({

	getInitialState: function() {
		return {
			user: SydJS.user,
			isBusy: false,
			isReady: RSVPStore.isLoaded(),
			meetup: RSVPStore.getMeetup(),
			rsvp: RSVPStore.getRSVP(),
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
			isBusy: RSVPStore.isBusy(),
			isReady: RSVPStore.isLoaded(),
			meetup: RSVPStore.getMeetup(),
			rsvp: RSVPStore.getRSVP(),
		});
	},

	toggleRSVP: function(attending) {
		RSVPStore.rsvp(attending);
	},

	renderWelcome: function() {
		if (this.state.rsvp.attending) {
			return <h4 className="hero-button-title"><span className = "welcome-message">We have your RSVP</span></h4>
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

	renderBusy: function() {
		return (
			<div className="hero-button">
				<div className="alert alert-success mb-0 text-center">hold on...</div>
			</div>
		);
	},

	renderRSVPButton: function() {
		return (
			<div className="hero-button" onClick={this.toggleRSVP.bind(this, true)}>
				<a className="btn btn-primary btn-lg btn-block">
					RSVP Now (<span className="text-thin">{this.state.meetup.remainingRSVPs} spots left</span>)
				</a>
			</div>
		);
	},

	renderRSVPToggle: function() {
		var attending = this.state.rsvp.attending ?  ' btn-success btn-default active' : null;
		var notAttending = this.state.rsvp.attending ? null : ' btn-danger btn-default active';
		return (
			<div>
				{this.renderWelcome()}
				<div className="hero-button">
					<div id="next-meetup" data-id={this.state.meetup._id} className="form-row meetup-toggle">
						<div className="col-xs-8">
							<button type="button" onClick={this.toggleRSVP.bind(this, true)} className={"btn btn-lg btn-block btn-default js-rsvp-attending " + attending}>
								<span>You're coming!</span>
							</button>
						</div>
						<div className="col-xs-4">
							<button type="button" onClick={this.toggleRSVP.bind(this, false)} className={"btn btn-lg btn-block btn-default btn-decline js-rsvp-decline " + notAttending}>Can't make it?</button>
						</div>
					</div>
				</div>
			</div>
		);
	},

	// MAKESHIFT WAY TO EXPOSE JQUERY AUTH LOGIC TO REACT
	signinModalTrigger: function (e) {
		e.preventDefault;
		window.signinModalTrigger(e);
	},

	renderRSVPSignin: function() {
		return (
			<div className="hero-button">
				<a className="btn btn-primary btn-lg btn-block js-auth-trigger" onClick={this.signinModalTrigger}>RSVP Now <span className="text-thin">({this.state.meetup.remainingRSVPs} spots left)</span></a>
			</div>
		);
	},

	renderNoMoreTickets: function() {
		return (
			<div className="hero-button">
				<div className="alert alert-success mb-0 text-center">No more tickets...</div>
			</div>
		);
	},

	render: function() {
		if (!this.state.isReady) {
			return this.renderLoading();
		}
		if (this.state.isBusy) {
			return this.renderBusy();
		}

		var hasUser = !!this.state.user;
		var isRsvpOpen = this.state.meetup.rsvpsAvailable;
		var hasRsvped = this.state.rsvp.exists;
		var isAttending = this.state.rsvp.attending;

		if (!isRsvpOpen) {
			return hasUser && isAttending ? this.renderRSVPToggle() : this.renderNoMoreTickets();
		} else if (hasUser) {
			return hasRsvped ? this.renderRSVPToggle() : this.renderRSVPButton();
		} else {
			return this.renderRSVPSignin();
		}
	},
});

module.exports = HeroApp;
