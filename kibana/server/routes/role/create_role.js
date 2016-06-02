var Promise = require('bluebird'),
    uuid = require('uuid'),
    Boom = require('boom'),
	  helper = require('./helper');

module.exports = function (server) {
    var config = server.config();
    var index = config.get('goriguard.indexPattern');

    server.route({
    path: '/goriguard/realm/{realmId}/role',
    method: 'POST',
    handler: function (req, reply) {
      var roleId = uuid.v4();
      Promise.try(helper.createRole(server, req, roleId))
      .then(function(arg) {
        // TODO: get the hostname dynamically
        // TODO: use template for log not concat
        server.log('info', {
          tmpl: 'Role <%= roleId %> created - http://localhost:9200/'+index+'/role/'+roleId+'/',
          roleId: roleId
        });

        reply({status: 'role created', link: 'http://localhost:9200/'+index+'/role/'+roleId+'/'});
      })
      .catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });

  return server;
}