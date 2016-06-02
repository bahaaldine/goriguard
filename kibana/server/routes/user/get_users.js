var Promise = require('bluebird'),
    Boom = require('boom'),
	  helper = require('./helper.js');

module.exports = function (server) {
  
    server.route({
    path: '/goriguard/realm/{realmId}/users',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getUsers(server, req))
      .then(function(users) {
        reply(users.hits);
      }).catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });


  return server;
}
