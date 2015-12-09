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

// WIP
// module.exports.date = new GraphQL.GraphQLObjectType({
// 	name: 'KeystoneDate',
// 	fields: {
// 		format: {
// 			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
// 			args: {
// 				tokens: {
// 					type: GraphQL.GraphQLString,
// 					default: 'Do MMM YYYY',
// 				}
// 			},
// 			description: 'A formated string using http://momentjs.com/docs/#/displaying/format/',
// 			resolve: (source, args) => {
// 				// console.dir(source);
// 				return source._.format(args.token);
// 			}
// 		},
// 	},
// })
