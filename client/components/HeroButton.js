var React = require('react/addons');

var HeroButton = React.createClass({

	getInitialState: function() {
		return {
			isAttending: false 
		};
	},

	toggleAttendingStatus: function() {
		this.setState({ isAttending: !this.state.isAttending })
	},

	render: function() {
		console.log(this.props)
		return (
			<div> 
				<h4 className="hero-button-title">Are you coming? <br /><span className="text-thin">119 spots left</span></h4>
				<div id="next-meetup" className="form-row meetup-toggle">
					<div className="col-xs-4 col-xs-offset-4">
						<button id="react-rsvp-button" type="button" isAttending={this.state.isAttending} onClick={this.toggleAttendingStatus} className="btn btn-lg btn-block btn-default js-rsvp-attending">{this.state.isAttending ? "Yes" : "No" }</button>
						<h4 className="attending-message mt-2">{this.state.isAttending ? "Looking foward to seeing you there!" : null}</h4>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = HeroButton

// <p className="mt-10">{this.props.status.meetups ? this.props.status.meetups.last.name : null}</p>