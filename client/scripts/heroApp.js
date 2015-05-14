var React = require('react/addons');
var HeroButton = require('../components/heroButton');
var request = require('superagent');

var IntroApp = React.createClass({

	getInitialState: function() {
		return {
			status: '' 
		};
	},

	componentDidMount: function() {
		request
			.get('/api/app/status')
			.end(function(err, res) {
				var status = res.body
				if (!err && this.isMounted()) {
					this.setState({
						status: status
					})
				}
			}.bind(this));
	},

	render: function() {
		return (
			<div> 
				<HeroButton status={this.state.status} />
			</div>
		);
	}
});

React.render(<IntroApp />, document.getElementById('react-hero-button'));
