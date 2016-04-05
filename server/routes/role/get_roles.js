var Promise = require('bluebird'),
    Boom = require('boom'),
	  helper = require('./helper');

module.exports = function (server) {
  
    server.route({
    path: '/goriguard/realm/{realmId}/roles',
    method: 'GET',
    handler: function (req, reply) {
      console.info('/goriguard/realm/'+req.params.realmId+'/roles');
      
      Promise.try(helper.getRoles(server, req))
      .then(function(roles) {
        reply(roles.hits);
      }).catch(function(err){
        reply(Boom.badRequest(err.name + ': ' + err.message));
      });
    }
  });


  return server;
}
