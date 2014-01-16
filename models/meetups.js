var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Meetups Model
 * =============
 */

var Meetup = new keystone.List('Meetup');

Meetup.add({
	name: { type: String, required: true, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	date: { type: Types.Date, required: true, initial: true, index: true },
	time: { type: String, required: true, initial: true, width: 'short', default: '6pm - 9pm', note: 'e.g. 6pm - 9pm' },
	place: { type: String, required: true, initial: true, width: 'medium', default: 'Level 6, 341 George St (Atlassian) – Enter via the side door in Wynyard Street', note: 'usually Level 6, 341 George St (Atlassian) – Enter via the side door in Wynyard Street' },
	description: { type: Types.Html, wysiwyg: true },
	maxRSVPs: { type: Number, default: 100 },
	totalRSVPs: { type: Number, noedit: true }
});


/**
 * Relationships
 * =============
 */

Meetup.relationship({ ref: 'Talk', refPath: 'meetup', path: 'talks' });
Meetup.relationship({ ref: 'RSVP', refPath: 'meetup', path: 'rsvps' });


/**
 * Virtuals
 * ========
 */

Meetup.schema.virtual('remainingRSVPs').get(function() {
	if (!this.maxRSVPs) return -1;
	return Math.max(this.maxRSVPs - (this.totalRSVPs || 0), 0);
});

Meetup.schema.virtual('rsvpsAvailable').get(function() {
	return (this.remainingRSVPs != 0);
});


/**
 * Methods
 * =======
 */

Meetup.schema.methods.refreshRSVPs = function(callback) {
	
	var meetup = this;
	
	keystone.list('RSVP').model.count()
		.where('meetup').in([meetup.id])
		.where('attending', true)
		.exec(function(err, count) {
			
			if (err) return callback(err);
			
			meetup.totalRSVPs = count;
			meetup.save(callback);
			
		});
	
}


/**
 * Registration
 * ============
 */

Meetup.addPattern('standard meta');
Meetup.defaultColumns = 'name, state|20%, date|20%';
Meetup.register();
