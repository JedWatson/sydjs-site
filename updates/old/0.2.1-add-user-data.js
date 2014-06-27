var keystone = require('keystone');

exports = module.exports = function(done) {
	keystone.list('User').updateAll(done);
};

exports.__defer__ = true;

