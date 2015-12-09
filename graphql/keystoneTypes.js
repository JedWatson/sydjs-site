var GraphQL = require('graphql');

module.exports.name = new GraphQL.GraphQLObjectType({
	name: 'UserName',
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
