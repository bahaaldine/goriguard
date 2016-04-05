var Promise = require('bluebird');
var indexTemplate = require('./json/stat_index_template.json');
module.exports = function (server) {
  var client = server.plugins.elasticsearch.client;
  return function() {
	  return client.indices.putTemplate({
	    name: 'goriguard-*',
	    body: indexTemplate
	  });
	}
} 
