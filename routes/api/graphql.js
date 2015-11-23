var GraphQL = require('graphql');
var keystone = require('keystone');
var Meetup = keystone.list('Meetup');

function getMeetup (id) {
	if (id === 'next') {
		return Meetup.model.findOne().sort('-startDate').where('state', 'active');
	} else if (id === 'last') {
		return Meetup.model.findOne().sort('-startDate').where('state', 'past');
	} else {
		return Meetup.model.findById(id);
	}
}

var meetupType = new GraphQL.GraphQLObjectType({
	name: 'Meetup',
	fields: () => ({
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The id of the meetup.',
		},
		name: {
			type: GraphQL.GraphQLString,
			description: 'The name of the meetup.',
		},
	}),
});

var schema = new GraphQL.GraphQLSchema({
	query: new GraphQL.GraphQLObjectType({
		name: 'RootQueryType',
		fields: () => ({
			meetup: {
				type: meetupType,
				args: {
					id: {
						description: 'id of the meetup, can be "next" or "last"',
						type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
					},
				},
				resolve: (root, args) => getMeetup(args.id),
			},
		}),
	}),
});

module.exports = function (req, res) {
	GraphQL.graphql(schema, req.body)
		.then((result) => {
			res.send(JSON.stringify(result, null, 2));
		});
}
