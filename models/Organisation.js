var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Organisations Model
 * ===================
 */

var Organisation = new keystone.List('Organisation', {
	autokey: { path: 'key', from: 'name', unique: true }
});

Organisation.add({
	name: { type: String, index: true },
	logo: { type: Types.CloudinaryImage },
	website: Types.Url,
	isHiring: Boolean,
	description: { type: Types.Markdown },
	location: Types.Location
});


/**
 * Relationships
 * =============
 */

Organisation.relationship({ ref: 'User', refPath: 'organisation', path: 'members' });


/**
 * Registration
 * ============
 */

Organisation.addPattern('standard meta');
Organisation.defaultColumns = 'name, website, isHiring';
Organisation.register();
