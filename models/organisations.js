var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Organisation = new keystone.List('Organisation', {
	autokey: { path: 'key', from: 'name', unique: true }
});

Organisation.add({
	name: { type: String, index: true },
	logo: { type: Types.CloudinaryImage },
	website: Types.Url,
	isHiring: Boolean,
	description: { type: Types.Html, wysiwyg: true, height: 150 },
	location: Types.Location
});

Organisation.relationship({ ref: 'User', refPath: 'organisation', path: 'members' });

Organisation.addPattern('standard meta');
Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
