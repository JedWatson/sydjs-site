var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Talk = new keystone.List('Talk', {
	sortable: true,
	sortContext: 'Meetup:talks'
});

Talk.add({
	name: { type: String, required: true, initial: true },
	meetup: { type: Types.Relationship, ref: 'Meetup', required: true, initial: true, index: true },
	who: { type: Types.Relationship, ref: 'User', many: true, index: true },
	description: { type: Types.Html, wysiwyg: true }
});

Talk.addPattern('standard meta');
Talk.register();
