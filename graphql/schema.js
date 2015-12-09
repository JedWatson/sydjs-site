var GraphQL = require('graphql');

var keystone = require('keystone');
var Meetup = keystone.list('Meetup');
var Talk = keystone.list('Talk');

function getMeetup (id) {
	if (id === 'next') {
		return Meetup.model.findOne().sort('-startDate')
						.where('state', 'active').exec();
	} else if (id === 'last') {
		return Meetup.model.findOne().sort('-startDate')
						.where('state', 'past').exec();
	} else {
		return Meetup.model.findById(id).exec();
	}
}

var meetupStateEnum = new GraphQL.GraphQLEnumType({
	name: 'MeetupState',
	description: 'The state of the meetup',
	values: {
		draft: {
			description: 'Draft'
		},
		scheduled: {
			description: 'Scheduled'
		},
		active: {
			description: 'Active'
		},
		past: {
			description: 'Past'
		}
	}
});

var meetupType = new GraphQL.GraphQLObjectType({
	name: 'Meetup',
	fields: () => ({
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The id of the meetup.'
		},
		name: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The name of the meetup.'
		},
		publishedDate: {
			type: GraphQL.GraphQLString
		},
		state: {
			type: new GraphQL.GraphQLNonNull(meetupStateEnum)
		},
		startDate: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
		},
		endDate: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
		},
		place: {
			type: GraphQL.GraphQLString
		},
		map: {
			type: GraphQL.GraphQLString
		},
		description: {
			type: GraphQL.GraphQLString
		},
		maxRSVPs: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt)
		},
		totalRSVPs: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt)
		},
		url: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
		},
		remainingRSVPs: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt)
		},
		rsvpsAvailable: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean)
		}
	})
});

var talkType = new GraphQL.GraphQLObjectType({
	name: 'Talk',
	fields: () => ({
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The id of the talk.'
		},
		name: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The title of the talk.'
		},
		isLightningTalk: {
			type: GraphQL.GraphQLBoolean,
			description: 'Whether the talk is a Lightning talk'
		},
		meetup: {
			type: new GraphQL.GraphQLNonNull(meetupType),
			description: 'The Meetup the talk is scheduled for'
		},
		// TODO: who (relationship to User)
		description: {
			type: GraphQL.GraphQLString
		},
		slides: {
			type: GraphQL.GraphQLString
		},
		link: {
			type: GraphQL.GraphQLString
		}
	})
});

function getTalk (id) {
	return Talk.model.findById(id);
}

var queryRootType = new GraphQL.GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		meetup: {
			type: meetupType,
			args: {
				id: {
					description: 'id of the meetup, can be "next" or "last"',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
				}
			},
			resolve: (root, args) => getMeetup(args.id)
		},
		talk: {
			type: talkType,
			args: {
				id: {
					description: 'id of the talk',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString)
				}
			},
			resolve: (root, args) => getTalk(args.id)
		}
	})
});

module.exports = new GraphQL.GraphQLSchema({
	query: queryRootType
});
