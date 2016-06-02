var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/roles',
    method: 'PUT',
    handler: function (request, reply) {
      Promise.try(helper.deleteRolesById(server, request))
      .then(function(response){
        reply(response);
      });
    }
  });

  return server;
}
