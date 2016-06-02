var Promise = require('bluebird'),
    Boom = require('boom'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm/{realmId}/user',
    method: 'PUT',
    handler: function (req, reply) {
      Promise.try(helper.updateUser(server, req))
      .then(function(arg) {
        // TODO: get the hostname dynamically
        // TODO: use template for log not concat
        server.log('info', {
          tmpl: 'User <%= userId %> updated - http://localhost:9200/<%= index %>/user/<%= userId %>/',
          userId: arg._id,
          index: arg._index
        });

        reply({status: 'user updated', link: 'http://localhost:9200/'+arg._index+'/user/'+arg._id+'/'});
      })
      .catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });

  return server;
}
