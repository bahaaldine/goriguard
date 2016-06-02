var Promise = require('bluebird'),
    Boom = require('boom'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/role',
    method: 'PUT',
    handler: function (req, reply) {
      Promise.try(helper.updateRole(server, req))
      .then(function(arg) {
        // TODO: get the hostname dynamically
        // TODO: use template for log not concat
        server.log('info', {
          tmpl: 'Role <%= roleId %> updated - http://localhost:9200/<%= index %>/role/<%= roleId %>/',
          roleId: arg._id,
          index: arg._index
        });

        reply({status: 'role updated', link: 'http://localhost:9200/'+arg._index+'/role/'+arg._id+'/'});
      })
      .catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });

  return server;
}
