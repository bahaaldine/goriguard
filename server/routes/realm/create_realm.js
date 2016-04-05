var Promise = require('bluebird'),
    uuid = require('uuid'),
    Boom = require('boom'),
	  helper = require('./helper');

module.exports = function (server) {
    var config = server.config();
    var index = config.get('goriguard.indexPattern');

    server.route({
    path: '/goriguard/realm',
    method: 'POST',
    handler: function (req, reply) {
      var realmId = uuid.v4();
      Promise.try(helper.createRealm(server, req, realmId))
      .then(function(arg) {
        // TODO: get the hostname dynamically
        // TODO: use template for log not concat
        server.log('info', {
          tmpl: 'Realm <%= realmId %> created - http://localhost:9200/'+index+'/realm/'+realmId+'/',
          realmId: realmId
        });

        reply({status: 'realm created', link: 'http://localhost:9200/'+index+'/realm/'+realmId+'/'});
      })
      .catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });

  return server;
}