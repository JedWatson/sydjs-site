var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Links Model
 * ===========
 */

var Link = new keystone.List('Link', {
	map: { name: 'label' },
	autokey: { path: 'slug', from: 'label', unique: true }
});

Link.add({
	label: { type: String, required: true, initial: true },
	href: { type: Types.Url, required: true, initial: true },
	description: { type: Types.Markdown, initial: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	tags: { type: Types.Relationship, ref: 'LinkTag', many: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true }
});


/**
 * Relationships
 * =============
 */

Link.relationship({ ref: 'LinkComment', refPath: 'link', path: 'comments' });


/**
 * Registration
 * ============
 */

Link.addPattern('standard meta');
Link.defaultColumns = 'label, href, author|20%, state|20%';
Link.register();
