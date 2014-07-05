var keystone = require('keystone'),
	_ = require('underscore'),
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
	isLightningTalk: { type: Boolean },
	meetup: { type: Types.Relationship, ref: 'Meetup', required: true, initial: true, index: true },
	who: { type: Types.Relationship, ref: 'User', many: true, index: true },
	description: { type: Types.Html, wysiwyg: true },
	slides: { type: Types.Url },
	link: { type: Types.Url }
});

Talk.schema.set('toJSON', {
	virtuals: true,
	transform: function(doc, rtn, options) {
		
		rtn = _.pick(rtn, '_id', 'name', 'place', 'map', 'description', 'slides', 'link');
		
		if (doc.who) {
			rtn.who = doc.who.map(function(i) {
				return {
					name: i.name,
					twitter: i.twitter,
					avatarUrl: i.avatarUrl
				}
			});
		}
		
		return rtn;
		
	}
});

/**
 * Registration
 * ============
 */

Talk.addPattern('standard meta');
Talk.defaultColumns = 'name, meetup|20%, who|20%';
Talk.register();
