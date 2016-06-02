var Promise = require('bluebird'),
    Boom = require('boom'),
	  helper = require('./helper.js');

module.exports = function (server) {
  
    server.route({
    path: '/goriguard/realm/{realmId}/sessions',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getSessions(server, req))
      .then(function(sessions) {
        reply(sessions.hits);
      }).catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });


  return server;
}
