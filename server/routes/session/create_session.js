var Promise = require('bluebird'),
	  helper = require('./helper'),
    Boom = require('boom'),
    uuid = require('uuid');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/session',
    method: 'POST',
    handler: function (req, reply) {
      Promise.try(helper.getUserByEmailAndToken(server, req))
      .then(function(response) {
        console.log(response.hits.hits.length)
        if ( response.hits.hits.length == 1) {
          var sessionId = uuid.v4();
          Promise.try(helper.createSession(server, req, sessionId))
          .then(function(session) {
            reply(session);
          });   
        } else {
          reply(Boom.unauthorized('access denied'));
        }
      });
    }
  });

  return server;
}
