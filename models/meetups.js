var keystone = require('keystone'),
	Types = keystone.Field.Types;

var Meetup = new keystone.List('Meetup');

Meetup.add({
	name: { type: String, required: true, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	date: { type: Types.Date, required: true, initial: true, index: true },
	time: { type: String, required: true, initial: true, width: 'short', default: '6pm - 9pm', note: 'e.g. 6pm - 9pm' },
	place: { type: String, required: true, initial: true, width: 'medium', default: 'Level 6, 341 George St (Atlassian) – Enter via the side door in Wynyard Street', note: 'usually Level 6, 341 George St (Atlassian) – Enter via the side door in Wynyard Street' },
	description: { type: Types.Html, wysiwyg: true }
});

Meetup.relationship({ ref: 'Talk', refPath: 'meetup', path: 'talks' });
Meetup.relationship({ ref: 'RSVP', refPath: 'meetup', path: 'rsvps' });

Meetup.schema.methods.refreshRSVPs = function() {
	
}

Meetup.addPattern('standard meta');
Meetup.defaultColumns = 'name, state|20%, date|20%';
Meetup.register();
