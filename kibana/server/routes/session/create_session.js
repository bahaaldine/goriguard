var Promise = require('bluebird'),
	  helper = require('./helper'),
    Boom = require('boom'),
    uuid = require('uuid');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/session',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getUserByEmailAndToken(server, req))
      .then(function(response) {
        if ( response.hits.hits.length == 1) {
          var sessionId = uuid.v4();
          var user = response.hits.hits[0]._source;
          Promise.try(helper.createSession(server, req, sessionId, user))
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
