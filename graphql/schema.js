var GraphQL = require('graphql');
var GraphQLRelay = require('graphql-relay');
var keystoneTypes = require('./keystoneTypes');

var keystone = require('keystone');
var Meetup = keystone.list('Meetup');
var Talk = keystone.list('Talk');
var User = keystone.list('User');
var RSVP = keystone.list('RSVP');
var Organisation = keystone.list('Organisation');

var nodeDefinitions = GraphQLRelay.nodeDefinitions(
	(globalId) => {
		var {type, id} = GraphQLRelay.fromGlobalId(globalId);

		switch (type) {
		case 'Meetup':
			return Meetup.model.findById(id).exec();
		case 'Talk':
			return Talk.model.findById(id).exec();
		case 'User':
			return User.model.findById(id).exec();
		case 'RSVP':
			return RSVP.model.findById(id).exec();
		case 'Organisation':
			return Organisation.model.findById(id).exec();
		default:
			return null;
		}
	},
	(obj) => {
		if (obj instanceof Meetup.model) {
			return meetupType;
		} else if (obj instanceof Talk.model) {
			return talkType;
		} else if (obj instanceof User.model) {
			return userType;
		} else if (obj instanceof RSVP.model) {
			return rsvpType;
		} else if (obj instanceof Organisation.model) {
			return organisationType;
		}
		return null;
	}
);

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
		// TODO when the new version of `graphql-relay` comes out it
		// will not need the typeName String 'Meetup' because it will call
		// `info.parentType.name` inside the `globalIdField` function
		id: GraphQLRelay.globalIdField('Meetup'),
		name: {
			type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLString),
			description: 'The name of the meetup.',
		},
		publishedDate: keystoneTypes.date(Meetup.fields.publishedDate),
		state: {
			type: new GraphQL.GraphQLNonNull(meetupStateEnum),
		},
		startDate: keystoneTypes.datetime(Meetup.fields.startDate),
		endDate: keystoneTypes.datetime(Meetup.fields.endDate),
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
	interfaces: [nodeDefinitions.nodeInterface],
});

var talkType = new GraphQL.GraphQLObjectType({
	name: 'Talk',
	fields: () => ({
		id: GraphQLRelay.globalIdField('Talk'),
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
			type: keystoneTypes.link,
			resolve: (source) => ({
				raw: source.slides,
				format: source._.slides.format,
			}),
		},
		link: {
			type: keystoneTypes.link,
			resolve: (source) => ({
				raw: source.link,
				format: source._.link.format,
			}),
		},
	}),
	interfaces: [nodeDefinitions.nodeInterface],
});

var userType = new GraphQL.GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: GraphQLRelay.globalIdField('User'),
		name: {
			type: new GraphQL.GraphQLNonNull(keystoneTypes.name),
		},
		email: {
			type: keystoneTypes.email,
			resolve: (source) => ({
				email: source.email,
				gravatarUrl: source._.email.gravatarUrl,
			}),
		},
		talks: {
			type: new GraphQL.GraphQLList(talkType),
			resolve: (source) =>
				Talk.model.find().where('who', source.id).exec(),
		},
		rsvps: {
			type: new GraphQL.GraphQLList(rsvpType),
			resolve: (source) =>
				RSVP.model.find().where('who', source.id).exec(),
		},
	}),
	interfaces: [nodeDefinitions.nodeInterface],
});

var rsvpType = new GraphQL.GraphQLObjectType({
	name: 'RSVP',
	fields: {
		id: GraphQLRelay.globalIdField('RSVP'),
		meetup: {
			type: new GraphQL.GraphQLNonNull(meetupType),
			resolve: (source) => Meetup.model.findById(source.meetup).exec(),
		},
		who: {
			type: new GraphQL.GraphQLNonNull(userType),
			resolve: (source) => User.model.findById(source.who).exec(),
		},
		attending: { type: GraphQL.GraphQLBoolean },
		createdAt: keystoneTypes.datetime(Meetup.fields.createdAt),
		changedAt: keystoneTypes.datetime(Meetup.fields.changedAt),
	},
	interfaces: [nodeDefinitions.nodeInterface],
});

var organisationType = new GraphQL.GraphQLObjectType({
	name: 'Organisation',
	fields: {
		id: GraphQLRelay.globalIdField('Organisation'),
		name: { type: GraphQL.GraphQLString },
		logo: { type: keystoneTypes.cloudinaryImage },
		website: { type: GraphQL.GraphQLString },
		isHiring: { type: GraphQL.GraphQLBoolean },
		description: { type: keystoneTypes.markdown },
		location: { type: keystoneTypes.location },
		members: {
			type: new GraphQL.GraphQLList(userType),
			resolve: (source) =>
				User.model.find().where('organisation', source.id).exec(),
		},
	},
	interfaces: [nodeDefinitions.nodeInterface],
});

var queryRootType = new GraphQL.GraphQLObjectType({
	name: 'Query',
	fields: {
		node: nodeDefinitions.nodeField,
		meetup: {
			type: meetupType,
			args: {
				id: {
					description: 'id of the meetup, can be "next" or "last"',
					type: new GraphQL.GraphQLNonNull(GraphQL.GraphQLID),
				},
			},
			resolve: (_, args) => {
				if (args.id === 'next') {
					return Meetup.model.findOne().sort('-startDate')
									.where('state', 'active').exec();
				} else if (args.id === 'last') {
					return Meetup.model.findOne().sort('-startDate')
									.where('state', 'past').exec();
				} else {
					return Meetup.model.findById(args.id).exec();
				}
			},
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
