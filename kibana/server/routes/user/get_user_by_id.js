var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/user/{userId}',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getUserById(server, req))
      .then(function(user){
        reply({user: user});
      });
    }
  });

  return server;
}
