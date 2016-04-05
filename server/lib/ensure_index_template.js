var indexTemplate = require('./json/index_template.json');
module.exports = function (server) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
	var index = config.get('goriguard.indexPattern');
  return function() {
	  return client.indices.putTemplate({
	    name: index,
	    body: indexTemplate
	  });
	}
} 
