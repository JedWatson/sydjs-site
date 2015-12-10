var GraphQL = require('graphql');

module.exports.name = new GraphQL.GraphQLObjectType({
	name: 'KeystoneName',
	fields: {
		first: {
			type: GraphQL.GraphQLString,
		},
		last: {
			type: GraphQL.GraphQLString,
		},
		full: {
			type: GraphQL.GraphQLString,
		},
	},
});

module.exports.cloudinaryImage = new GraphQL.GraphQLObjectType({
	name: 'KeystoneCloudinaryImage',
	fields: {
		public_id: {
			type: GraphQL.GraphQLString,
		},
		version: {
			type: GraphQL.GraphQLInt,
		},
		signature: {
			type: GraphQL.GraphQLString,
		},
		format: {
			type: GraphQL.GraphQLString,
		},
		resource_type: {
			type: GraphQL.GraphQLString,
		},
		url: {
			type: GraphQL.GraphQLString,
		},
		width: {
			type: GraphQL.GraphQLInt,
		},
		height: {
			type: GraphQL.GraphQLInt,
		},
		secure_url: {
			type: GraphQL.GraphQLString,
		},
	},
});

module.exports.location = new GraphQL.GraphQLObjectType({
	name: 'KeystoneLocation',
	fields: {
		name: {
			type: GraphQL.GraphQLString,
		},
		number: {
			type: GraphQL.GraphQLInt,
		},
		street1: {
			type: GraphQL.GraphQLString,
		},
		street2: {
			type: GraphQL.GraphQLString,
		},
		suburb: {
			type: GraphQL.GraphQLString,
		},
		state: {
			type: GraphQL.GraphQLString,
		},
		postcode: {
			type: GraphQL.GraphQLInt,
		},
		country: {
			type: GraphQL.GraphQLInt,
		},
		geo: {
			type: new GraphQL.GraphQLList(GraphQL.GraphQLString),
			description: 'An array [longitude, latitude]',
		},
	},
});

module.exports.date = (field) => ({
	type: GraphQL.GraphQLString,
	args: {
		format: {
			type: GraphQL.GraphQLString,
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

module.exports.datetime = (field) => ({
	type: GraphQL.GraphQLString,
	args: {
		format: {
			type: GraphQL.GraphQLString,
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

module.exports.link = new GraphQL.GraphQLObjectType({
	name: 'KeystoneLink',
	fields: {
		raw: {
			type: GraphQL.GraphQLString,
			description: 'The raw unformmated URL',
		},
		format: {
			type: GraphQL.GraphQLString,
			description: 'The URL after being passed through the `format Function` option',
		},
	},
});

module.exports.markdown = new GraphQL.GraphQLObjectType({
	name: 'KeystoneMarkdown',
	fields: {
		md: {
			type: GraphQL.GraphQLString,
			description: 'source markdown text',
		},
		html: {
			type: GraphQL.GraphQLString,
			description: 'generated html code',
		},
	},
});

module.exports.email = new GraphQL.GraphQLObjectType({
	name: 'KeystoneEmail',
	fields: {
		email: {
			type: GraphQL.GraphQLString,
		},
		gravatarUrl: {
			type: GraphQL.GraphQLString,
			args: {
				size: {
					type: GraphQL.GraphQLInt,
					defaultValue: 80,
					description: 'Size of images ranging from 1 to 2048 pixels, square',
				},
				defaultImage: {
					type: GraphQL.GraphQLString,
					defaultValue: 'identicon',
					description: 'default image url encoded href or one of the built ' +
						'in options: 404, mm, identicon, monsterid, wavatar, retro, blank',
				},
				rating: {
					type: GraphQL.GraphQLString,
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
