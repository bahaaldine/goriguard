var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/role/{roleId}',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getRoleById(server, req))
      .then(function(role){
        reply({role: role});
      });
    }
  });

  return server;
}
