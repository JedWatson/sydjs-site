import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';

export var name = new GraphQLObjectType({
	name: 'KeystoneName',
	fields: {
		first: {
			type: GraphQLString,
		},
		last: {
			type: GraphQLString,
		},
		full: {
			type: GraphQLString,
		},
	},
});

export var cloudinaryImage = new GraphQLObjectType({
	name: 'KeystoneCloudinaryImage',
	fields: {
		public_id: {
			type: GraphQLString,
		},
		version: {
			type: GraphQLInt,
		},
		signature: {
			type: GraphQLString,
		},
		format: {
			type: GraphQLString,
		},
		resource_type: {
			type: GraphQLString,
		},
		url: {
			type: GraphQLString,
		},
		width: {
			type: GraphQLInt,
		},
		height: {
			type: GraphQLInt,
		},
		secure_url: {
			type: GraphQLString,
		},
	},
});

export var location = new GraphQLObjectType({
	name: 'KeystoneLocation',
	fields: {
		name: {
			type: GraphQLString,
		},
		number: {
			type: GraphQLInt,
		},
		street1: {
			type: GraphQLString,
		},
		street2: {
			type: GraphQLString,
		},
		suburb: {
			type: GraphQLString,
		},
		state: {
			type: GraphQLString,
		},
		postcode: {
			type: GraphQLInt,
		},
		country: {
			type: GraphQLInt,
		},
		geo: {
			type: new GraphQLList(GraphQLString),
			description: 'An array [longitude, latitude]',
		},
	},
});

export var date = (field) => ({
	type: GraphQLString,
	args: {
		format: {
			type: GraphQLString,
			description: 'A formated time using Moment.js tokens ' +
				'http://momentjs.com/docs/#/displaying/format/',
		},
	},
	resolve: (source, args) => {
		if (args.format) {
			return field.format(source, args.format);
		}
		return source.get(field.path);
	},
});

export var datetime = (field) => ({
	type: GraphQLString,
	args: {
		format: {
			type: GraphQLString,
			description: 'A formated datetime using Moment.js tokens ' +
				'http://momentjs.com/docs/#/displaying/format/',
		},
	},
	resolve: (source, args) => {
		if (args.format) {
			return field.format(source, args.format);
		}
		return source.get(field.path);
	},
});

export var link = new GraphQLObjectType({
	name: 'KeystoneLink',
	fields: {
		raw: {
			type: GraphQLString,
			description: 'The raw unformmated URL',
		},
		format: {
			type: GraphQLString,
			description: 'The URL after being passed through the `format Function` option',
		},
	},
});

export var markdown = new GraphQLObjectType({
	name: 'KeystoneMarkdown',
	fields: {
		md: {
			type: GraphQLString,
			description: 'source markdown text',
		},
		html: {
			type: GraphQLString,
			description: 'generated html code',
		},
	},
});

export var email = new GraphQLObjectType({
	name: 'KeystoneEmail',
	fields: {
		email: {
			type: GraphQLString,
		},
		gravatarUrl: {
			type: GraphQLString,
			args: {
				size: {
					type: GraphQLInt,
					defaultValue: 80,
					description: 'Size of images ranging from 1 to 2048 pixels, square',
				},
				defaultImage: {
					type: GraphQLString,
					defaultValue: 'identicon',
					description: 'default image url encoded href or one of the built ' +
						'in options: 404, mm, identicon, monsterid, wavatar, retro, blank',
				},
				rating: {
					type: GraphQLString,
					defaultValue: 'g',
					description: 'the rating of the image, either rating, g, pg, r or x',
				},
			},
			description: 'Protocol-less Gravatar image request URL',
			resolve: (source, args) =>
				source.gravatarUrl(args.size, args.defaultImage, args.rating),
		},
	},
});
