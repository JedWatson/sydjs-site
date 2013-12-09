var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Talks Model
 * ===========
 */

var Talk = new keystone.List('Talk', {
	sortable: true,
	sortContext: 'Meetup:talks'
});

Talk.add({
	name: { type: String, required: true, initial: true },
	meetup: { type: Types.Relationship, ref: 'Meetup', required: true, initial: true, index: true },
	who: { type: Types.Relationship, ref: 'User', many: true, index: true },
	description: { type: Types.Html, wysiwyg: true },
	slides: { type: Types.Url },
	link: { type: Types.Url }
});


/**
 * Registration
 * ============
 */

Talk.addPattern('standard meta');
Talk.defaultColumns = 'name, meetup|20%, who|20%';
Talk.register();
