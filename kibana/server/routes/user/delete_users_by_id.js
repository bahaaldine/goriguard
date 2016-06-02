var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/users',
    method: 'PUT',
    handler: function (request, reply) {
      Promise.try(helper.deleteUsersById(server, request))
      .then(function(response){
        reply(response);
      });
    }
  });

  return server;
}
