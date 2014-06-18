var keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(done) {
	keystone.list('User').model.find().exec(function(err, members) {
	
		var count = 0;
		
		async.each(members, function(member, doneMember) {
		
			var setAvatar = false;
			
			if (member.services.github.isConfigured) {
				console.log('Set GitHub avatar for [' + member.name.full + '].');
				member.set('services.github.avatar', 'https://avatars.githubusercontent.com/u/' + member.services.github.profileId + '?');
				setAvatar = true;
				count++;
			}
			
			if (member.services.facebook.isConfigured) {
				console.log('Set Facebook avatar for [' + member.name.full + '].');
				member.set('services.facebook.avatar', 'https://graph.facebook.com/' + member.services.facebook.profileId + '/picture?width=600&height=600');
				setAvatar = true;
				count++;
			}
			
			if (setAvatar) {
				member.save();
				return doneMember();
			} else {
				return doneMember();
			}
		
		}, function(err) {
			console.log('Set [' + count + '] avatars.');
		});
	
	});
	
	return done();

};

exports.__defer__ = true;
