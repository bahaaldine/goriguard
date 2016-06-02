var Promise = require('bluebird'),
    uuid = require('uuid'),
    Boom = require('boom'),
	  helper = require('./helper');

module.exports = function (server) {
    var config = server.config();
    var index = config.get('goriguard.indexPattern');

    server.route({
    path: '/goriguard/realm/{realmId}/user',
    method: 'POST',
    handler: function (req, reply) {
      var userId = uuid.v4();
      Promise.try(helper.createUser(server, req, userId))
      .then(function(arg) {
        // TODO: get the hostname dynamically
        // TODO: use template for log not concat
        server.log('info', {
          tmpl: 'User <%= userId %> created - http://localhost:9200/'+index+'/user/'+userId+'/',
          userId: userId
        });

        reply({status: 'user created', link: 'http://localhost:9200/'+index+'/user/'+userId+'/'});
      })
      .catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });

  return server;
}