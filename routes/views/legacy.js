var keystone = require('keystone'),
	async = require('async'),
	_ = require('underscore'),
	moment = require('moment'),
	parse = require('csv-parse'),
	fs = require('fs');

exports = module.exports = function() {
	
	var currentMeetup = false;
	
	var addTalk = function(data, next) {
	
		console.log('Adding talk...');
		
		var matchedSpeakers = [];
		
		async.series([
			
			function(d) {
				
				var speakers = data[3].trim();
				
				if (!speakers) return d();
				
				console.log('-----');
				
				var speakerArray = speakers.replace(/\n/gi, '').split('@').slice(1);
				
				if (!speakerArray.length) return d();
				
				async.each(speakerArray, function(speaker, doneSpeaker) {
					var regex = new RegExp(speaker, 'i');
					keystone.list('User').model.find({ twitter: regex }).exec(function(err, users) {
						
						if (err || !users.length) return doneSpeaker();
						
						if (users.length == 1) {
							matchedSpeakers = users;
							return doneSpeaker();
						}
						
						console.log('Conflict for speaker - [' + users.length + '] users found for: ' + speaker );
						
						var targetUser = false;
						
						_.each(users, function(user) {
							if (targetUser) return;
							if (user.services.github.isConfigured) { targetUser = user; }
							else if (user.services.facebook.isConfigured) { targetUser = user; }
							else if (user.services.google.isConfigured) { targetUser = user; }
							else if (user.services.twitter.isConfigured) { targetUser = user; }
							if (targetUser) { console.log('Target user set.'); }
						});
						
						if (!targetUser) {
							console.log('No target user found for [' + speaker + ']');
						}
						
						matchedSpeakers.push(targetUser);
						
						return doneSpeaker();
						
					});
				}, function(err) {
					return d();
				});
				
			}
			
		], function(err) {
		
			var talk = {
				name: data[1].trim(),
				isLightningTalk: false,
				meetup: currentMeetup,
				who: matchedSpeakers,
				description: '',
				slides: data[4].trim(),
				link: data[5].trim()
			}
			
			if (!matchedSpeakers.length) {
				talk.legacy = {
					name: data[2].trim(),
					twitter: data[3].trim().replace(/\n/gi, '').split('@').slice(1).toString()
				}
			}
			
			if (!talk.name) {
				if (matchedSpeakers.length) {
					_.each(matchedSpeakers, function(s, i) {
						talk.name += s.name.full;
						if (matchedSpeakers.length - 1 != i) talk.name += ', ';
					});
				} else if (talk.legacy.name) {
					talk.name = talk.legacy.name;
				} else {
					talk.name = 'Unknown';
				}
			}
			
			var Talk = keystone.list('Talk');
			
			var newTalk = new Talk.model(talk).save(function(err) {
			
				if (err) {
					console.log(err);
					return next();
				}
				
				console.log('> ' + talk.name);
				
				return next();
				
			});
		
		});
	
	}
	
	var addMeetup = function(data, next) {
	
		console.log('Adding talk...');
		
		var meetup = {
			name: data[1].trim() || moment(data[0], 'DD/MM/YYYY').format('Do MMMM YYYY'),
			publishedDate: moment(data[0].trim(), 'DD/MM/YYYY').subtract('days', 7),
			
			state: 'past',
			date: moment(data[0].trim(), 'DD/MM/YYYY'),
			time: '',
			place: '',
			map: '',
			description: '',
			legacy: true
		}
		
		var Meetup = keystone.list('Meetup').model;
		var newMeetup = new Meetup(meetup);
		newMeetup.save(function(err) {
		
			if (err) {
				console.log(err);
				return next();
			}
			
			console.log('>>>>> ' + meetup.name + ' - ' + meetup.date.format('DD/MM/YYYY'));
			
			currentMeetup = newMeetup;
			
			return next();
			
		});
	
	}
	
	var parser = parse(function(err, data) {
		
		async.eachLimit(data, 1, function(row, next) {
			
			if (!row[0].trim()) return addTalk(row, next);
			
			addMeetup(row, next);
			
		}, function(err) {
			
			console.log('----------------------------------------')
			console.log('Added legacy meetups.');
			
		});
		
	});
	
	fs.createReadStream('./updates/data/legacy-meetups.csv').pipe(parser);
	
};
