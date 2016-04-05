var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getRealmById(server, req))
      .then(function(realm){
        reply({realm: realm});
      });
    }
  });

  return server;
}
