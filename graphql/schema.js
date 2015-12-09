var GraphQL = require('graphql');
var keystoneTypes = require('./keystoneTypes');

var keystone = require('keystone');
var Meetup = keystone.list('Meetup');
var Talk = keystone.list('Talk');
var User = keystone.list('User');
var RSVP = keystone.list('RSVP');
var Organisation = keystone.list('Organisation');

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
			description: "No published date, it's a draft meetup",
		},
		scheduled: {
			description: "Publish date is before today, it's a scheduled meetup",
		},
		active: {
			description: "Publish date is after today, it's an active meetup",
		},
		past: {
			description: "Meetup date plus one day is after today, it's a past meetup",
		},
	},
});

var meetupType = new GraphQL.GraphQLObjectType({
	name: 'Meetup',
	fields: () => ({
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
			description: 'The id of the meetup.',
		},
		name: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The name of the meetup.',
		},
		publishedDate: {
			type: GraphQL.GraphQLString,
		},
		state: {
			type: new GraphQL.GraphQLNonNull(meetupStateEnum),
		},
		startDate: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
		},
		endDate: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
		},
		place: {
			type: GraphQL.GraphQLString,
		},
		map: {
			type: GraphQL.GraphQLString,
		},
		description: {
			type: GraphQL.GraphQLString,
		},
		maxRSVPs: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
		},
		totalRSVPs: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
		},
		url: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
		},
		remainingRSVPs: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLInt),
		},
		rsvpsAvailable: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLBoolean),
		},
		talks: {
			type: new GraphQL.GraphQLList(talkType),
			resolve: (source) => Talk.model.find().where('meetup', source.id).exec(),
		},
		rsvps: {
			type: new GraphQL.GraphQLList(rsvpType),
			resolve: (source) => RSVP.model.find().where('meetup', source.id).exec(),
		},
	}),
});

var talkType = new GraphQL.GraphQLObjectType({
	name: 'Talk',
	fields: () => ({
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
			description: 'The id of the talk.',
		},
		name: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The title of the talk.',
		},
		isLightningTalk: {
			type: GraphQL.GraphQLBoolean,
			description: 'Whether the talk is a Lightning talk',
		},
		meetup: {
			type: new GraphQL.GraphQLNonNull(meetupType),
			description: 'The Meetup the talk is scheduled for',
			resolve: (source, args, info) =>
				Meetup.model.findById(source.meetup).exec(),
		},
		who: {
			type: new GraphQL.GraphQLList(userType),
			description: 'A list of at least one User running the talk',
			resolve: (source, args, info) =>
				User.model.find().where('_id').in(source.who).exec(),
		},
		description: {
			type: GraphQL.GraphQLString,
		},
		slides: {
			type: GraphQL.GraphQLString,
		},
		link: {
			type: GraphQL.GraphQLString,
		},
	}),
});

var userType = new GraphQL.GraphQLObjectType({
	name: 'User',
	fields: {
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
			description: 'The id of the user.',
		},
		name: {
			type: new GraphQL.GraphQLNonNull(keystoneTypes.name),
		},
		email: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
		},
	},
});

var rsvpType = new GraphQL.GraphQLObjectType({
	name: 'RSVP',
	fields: {
		id: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
			description: 'The id of the RSVP.',
		},
		meetup: {
			type: new GraphQL.GraphQLNonNull(meetupType),
			resolve: (source) => Meetup.model.findById(source.meetup).exec(),
		},
		who: {
			type: new GraphQL.GraphQLNonNull(userType),
			resolve: (source) => User.model.findById(source.who).exec(),
		},
		attending: { type: GraphQL.GraphQLBoolean },
		createdAt: {
			type: keystoneTypes.date,
			resolve: (source) => source._.createdAt,
		},
		changedAt: {
			type: keystoneTypes.date,
			resolve: (source) => source._.changedAt,
		},
	},
});

var organisationType = new GraphQL.GraphQLObjectType({
	name: 'Organisation',
	fields: {
		name: { type: GraphQL.GraphQLString },
		logo: { type: keystoneTypes.cloudinaryImage },
		website: { type: GraphQL.GraphQLString },
		isHiring: { type: GraphQL.GraphQLBoolean },
		description: { type: GraphQL.GraphQLString },
		location: { type: keystoneTypes.location },
		members: {
			type: new GraphQL.GraphQLList(userType),
			resolve: (source) =>
				User.model.find().where('organisation', source.id).exec(),
		},
	},
});

var queryRootType = new GraphQL.GraphQLObjectType({
	name: 'Query',
	fields: {
		meetup: {
			type: meetupType,
			args: {
				id: {
					description: 'id of the meetup, can be "next" or "last"',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				},
			},
			resolve: (_, args) => getMeetup(args.id),
		},
		talk: {
			type: talkType,
			args: {
				id: {
					description: 'id of the talk',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				},
			},
			resolve: (_, args) => Talk.model.findById(args.id).exec(),
		},
		organisation: {
			type: organisationType,
			args: {
				id: {
					description: 'id of the organisation',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				},
			},
			resolve: (_, args) => Organisation.model.findById(args.id).exec(),
		},
		user: {
			type: userType,
			args: {
				id: {
					description: 'id of the user',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				},
			},
			resolve: (_, args) => User.model.findById(args.id).exec(),
		},
		rsvp: {
			type: rsvpType,
			args: {
				id: {
					description: 'id of the RSVP',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				},
			},
			resolve: (_, args) => RSVP.model.findById(args.id).exec(),
		},
	},
});

module.exports = new GraphQL.GraphQLSchema({
	query: queryRootType,
});
