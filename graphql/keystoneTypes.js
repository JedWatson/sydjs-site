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

module.exports.date = new GraphQL.GraphQLObjectType({
	name: 'KeystoneDate',
	fields: {
		format: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			args: {
				stringOfTokens: {
					type: GraphQL.GraphQLString,
					default: 'Do MMM YYYY',
					description: 'A formated time using Moment.js tokens ' +
						'http://momentjs.com/docs/#/displaying/format/',
				},
			},
			resolve: (source, args) => source.format(args.stringOfTokens),
		},
	},
});

module.exports.datetime = new GraphQL.GraphQLObjectType({
	name: 'KeystoneDatetime',
	fields: {
		format: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			args: {
				stringOfTokens: {
					type: GraphQL.GraphQLString,
					default: 'Do MMM YYYY hh:mm:ss a',
					description: 'A formated datetime using Moment.js tokens ' +
						'http://momentjs.com/docs/#/displaying/format/',
				},
			},
			resolve: (source, args) => source.format(args.stringOfTokens),
		},
	},
});
