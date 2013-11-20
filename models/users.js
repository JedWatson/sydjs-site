var keystone = require('keystone'),
	Types = keystone.Field.Types;

var User = new keystone.List('User', {
	autokey: { path: 'key', from: 'name', unique: true }
});

var deps = {
	mentoring: { 'mentoring.available': true },
	
	github: { 'services.github.isConfigured': true },
	facebook: { 'services.facebook.isConfigured': true },
	twitter: { 'services.twitter.isConfigured': true }
}

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: false, index: true },
	password: { type: Types.Password, initial: true, required: false }
}, 'Profile', {
	isPublic: Boolean,
	organisation: { type: Types.Relationship, ref: 'Organisation' },
	photo: { type: Types.CloudinaryImage },
	github: { type: String, width: 'short' },
	twitter: { type: String, width: 'short' },
	website: { type: Types.Url },
	bio: { type: Types.Markdown }
}, 'Mentoring', {
	mentoring: {
		available: { type: Boolean, label: 'Is Available', index: true },
		free: { type: Boolean, label: 'For Free', dependsOn: deps.mentoring },
		paid: { type: Boolean, label: 'For Payment', dependsOn: deps.mentoring },
		swap: { type: Boolean, label: 'For Swap', dependsOn: deps.mentoring },
		have: { type: String, label: 'Has...', dependsOn: deps.mentoring },
		want: { type: String, label: 'Wants...', dependsOn: deps.mentoring }
	}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can Admin SydJS' }
}, 'Services', {
	services: {
		github: {
			isConfigured: { type: Boolean, label: 'GitHub has been authenticated' },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.github },
			profileUrl: { type: String, label: 'Profile URL', dependsOn: deps.github },
			
			username: { type: String, label: 'Username', dependsOn: deps.github },
			accessToken: { type: String, label: 'Access Token', dependsOn: deps.github }
		},
		facebook: {
			isConfigured: { type: Boolean, label: 'Facebook has been authenticated' },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.facebook },
			profileUrl: { type: String, label: 'Profile URL', dependsOn: deps.facebook },
			
			username: { type: String, label: 'Username', dependsOn: deps.facebook },
			accessToken: { type: String, label: 'Access Token', dependsOn: deps.facebook }
		},
		twitter: {
			isConfigured: { type: Boolean, label: 'Twitter has been authenticated' },
			
			profileId: { type: String, label: 'Profile ID', dependsOn: deps.twitter },
			
			username: { type: String, label: 'Username', dependsOn: deps.twitter },
			accessToken: { type: String, label: 'Access Token', dependsOn: deps.twitter }
		}
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});

User.relationship({ ref: 'Post', refPath: 'author', path: 'posts' });
User.relationship({ ref: 'Talk', refPath: 'who', path: 'talks' });
User.relationship({ ref: 'RSVP', refPath: 'who', path: 'rsvps' });

User.addPattern('standard meta');
User.defaultColumns = 'name, email, twitter, isAdmin';
User.register();
