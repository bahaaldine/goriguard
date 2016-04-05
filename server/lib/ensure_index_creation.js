module.exports = function (server) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
	var index = config.get('goriguard.indexPattern');

  return function() {
	  return client.indices.exists({
	  	index: index
	  }).then(function(exist){
	  	if ( !exist ) {
	  		return client.indices.create({
			    index: index
			  });
	  	}
	  });
	}
} 
