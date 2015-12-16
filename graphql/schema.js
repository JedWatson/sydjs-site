import {
	GraphQLBoolean,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString,
	GraphQLEnumType,
} from 'graphql';

import {
	fromGlobalId,
	globalIdField,
	nodeDefinitions,
	connectionDefinitions,
	connectionFromPromisedArray,
	connectionArgs,
} from 'graphql-relay';

var keystoneTypes = require('./keystoneTypes');

var keystone = require('keystone');
var Meetup = keystone.list('Meetup');
var Talk = keystone.list('Talk');
var User = keystone.list('User');
var RSVP = keystone.list('RSVP');
var Organisation = keystone.list('Organisation');

var {nodeInterface, nodeField} = nodeDefinitions(
	(globalId) => {
		var {type, id} = fromGlobalId(globalId);

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

var meetupStateEnum = new GraphQLEnumType({
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

var meetupType = new GraphQLObjectType({
	name: 'Meetup',
	fields: () => ({
		// TODO when the new version of `graphql-relay` comes out it
		// will not need the typeName String 'Meetup' because it will call
		// `info.parentType.name` inside the `globalIdField` function
		id: globalIdField('Meetup'),
		name: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The name of the meetup.',
		},
		publishedDate: keystoneTypes.date(Meetup.fields.publishedDate),
		state: {
			type: new GraphQLNonNull(meetupStateEnum),
		},
		startDate: keystoneTypes.datetime(Meetup.fields.startDate),
		endDate: keystoneTypes.datetime(Meetup.fields.endDate),
		place: {
			type: GraphQLString,
		},
		map: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		maxRSVPs: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		totalRSVPs: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		url: {
			type: new GraphQLNonNull(GraphQLString),
		},
		remainingRSVPs: {
			type: new GraphQLNonNull(GraphQLInt),
		},
		rsvpsAvailable: {
			type: new GraphQLNonNull(GraphQLBoolean),
		},
		talks: {
			type: talkConnection,
			args: connectionArgs,
			resolve: ({id}, args) => connectionFromPromisedArray(
				Talk.model.find().where('meetup', id).exec(),
				args
			),
		},
		rsvps: {
			type: rsvpConnection,
			args: connectionArgs,
			resolve: ({id}, args) => connectionFromPromisedArray(
				RSVP.model.find().where('meetup', id).exec(),
				args
			),
		},
	}),
	interfaces: [nodeInterface],
});

var talkType = new GraphQLObjectType({
	name: 'Talk',
	fields: () => ({
		id: globalIdField('Talk'),
		name: {
			type: new GraphQLNonNull(GraphQLString),
			description: 'The title of the talk.',
		},
		isLightningTalk: {
			type: GraphQLBoolean,
			description: 'Whether the talk is a Lightning talk',
		},
		meetup: {
			type: new GraphQLNonNull(meetupType),
			description: 'The Meetup the talk is scheduled for',
			resolve: (source, args, info) =>
				Meetup.model.findById(source.meetup).exec(),
		},
		who: {
			type: new GraphQLList(userType),
			description: 'A list of at least one User running the talk',
			resolve: (source, args, info) =>
				User.model.find().where('_id').in(source.who).exec(),
		},
		description: {
			type: GraphQLString,
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
	interfaces: [nodeInterface],
});

var userType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id: globalIdField('User'),
		name: {
			type: new GraphQLNonNull(keystoneTypes.name),
		},
		// email: {
		// 	type: keystoneTypes.email,
		// 	resolve: (source) => ({
		// 		email: source.email,
		// 		gravatarUrl: source._.email.gravatarUrl,
		// 	}),
		// },
		talks: {
			type: talkConnection,
			args: connectionArgs,
			resolve: ({id}, args) => connectionFromPromisedArray(
				Talk.model.find().where('who', id).exec(),
				args
			),
		},
		rsvps: {
			type: rsvpConnection,
			args: connectionArgs,
			resolve: ({id}, args) => connectionFromPromisedArray(
				RSVP.model.find().where('who', id).exec(),
				args
			),
		},
	}),
	interfaces: [nodeInterface],
});

var rsvpType = new GraphQLObjectType({
	name: 'RSVP',
	fields: {
		id: globalIdField('RSVP'),
		meetup: {
			type: new GraphQLNonNull(meetupType),
			resolve: (source) => Meetup.model.findById(source.meetup).exec(),
		},
		who: {
			type: new GraphQLNonNull(userType),
			resolve: (source) => User.model.findById(source.who).exec(),
		},
		attending: { type: GraphQLBoolean },
		createdAt: keystoneTypes.datetime(Meetup.fields.createdAt),
		changedAt: keystoneTypes.datetime(Meetup.fields.changedAt),
	},
	interfaces: [nodeInterface],
});

var organisationType = new GraphQLObjectType({
	name: 'Organisation',
	fields: () => ({
		id: globalIdField('Organisation'),
		name: { type: GraphQLString },
		logo: { type: keystoneTypes.cloudinaryImage },
		website: { type: GraphQLString },
		isHiring: { type: GraphQLBoolean },
		description: { type: keystoneTypes.markdown },
		location: { type: keystoneTypes.location },
		members: {
			type: userConnection,
			args: connectionArgs,
			resolve: ({id}, args) => connectionFromPromisedArray(
				User.model.find().where('organisation', id).exec(),
				args
			),
		},
	}),
	interfaces: [nodeInterface],
});

var {
	connectionType: meetupConnection,
} = connectionDefinitions({
	name: 'Meetup',
	nodeType: meetupType,
});
var {
	connectionType: talkConnection,
} = connectionDefinitions({
	name: 'Talk',
	nodeType: talkType,
});
var {
	connectionType: userConnection,
} = connectionDefinitions({
	name: 'User',
	nodeType: userType,
});
var {
	connectionType: rsvpConnection,
} = connectionDefinitions({
	name: 'RSVP',
	nodeType: rsvpType,
});
var {
	connectionType: organisationConnection,
} = connectionDefinitions({
	name: 'Organisation',
	nodeType: organisationType,
});

function modelFieldById (objectType, keystoneModel) {
	const modelIDField = `${objectType.name.toLowerCase()}ID`;
	return {
		type: objectType,
		args: {
			id: {
				description: `global ID of the ${objectType.name}`,
				type: GraphQLID,
			},
			[modelIDField]: {
				description: `MongoDB ID of the ${objectType.name}`,
				type: GraphQLID,
			},
		},
		resolve: (_, args) => {
			if (args[modelIDField] !== undefined && args[modelIDField] !== null) {
				return keystoneModel.model.findById(args[modelIDField]).exec();
			}

			if (args.id !== undefined && args.id !== null) {
				var {id: mongoID} = fromGlobalId(args.id);
				if (mongoID === null || mongoID === undefined ||
						mongoID === '') {
					throw new Error(`No valid ID extracted from ${args.id}`);
				}

				return keystoneModel.model.findById(mongoID).exec();
			}

			throw new Error('Must provide at least one argument');
		},
	};
}

var queryRootType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		node: nodeField,
		meetup: modelFieldById(meetupType, Meetup),
		allMeetups: {
			type: meetupConnection,
			args: {
				state: {
					type: meetupStateEnum,
				},
				...connectionArgs,
			},
			resolve: (_, {state, ...args}) => connectionFromPromisedArray(
				state ? Meetup.model.find().where('state', state).exec()
					:	Meetup.model.find().exec(),
				args
			),
		},
		talk: modelFieldById(talkType, Talk),
		allTalks: {
			type: talkConnection,
			args: connectionArgs,
			resolve: (_, args) => connectionFromPromisedArray(
				Talk.model.find().exec(),
				args
			),
		},
		organisation: modelFieldById(organisationType, Organisation),
		allOrganisations: {
			type: organisationConnection,
			args: connectionArgs,
			resolve: (_, args) => connectionFromPromisedArray(
				Organisation.model.find().exec(),
				args
			),
		},
		user: modelFieldById(userType, User),
		allUsers: {
			type: userConnection,
			args: connectionArgs,
			resolve: (_, args) => connectionFromPromisedArray(
				User.model.find().exec(),
				args
			),
		},
		RSVP: modelFieldById(rsvpType, RSVP),
		allRSVPs: {
			type: rsvpConnection,
			args: connectionArgs,
			resolve: (_, args) => connectionFromPromisedArray(
				RSVP.model.find().exec(),
				args
			),
		},
	},
});

export default new GraphQLSchema({
	query: queryRootType,
});
