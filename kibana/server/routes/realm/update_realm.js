var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realm',
    method: 'PUT',
    handler: function (req, reply) {
      Promise.try(helper.updateRealm(server, req))
      .then(function(arg) {
        // TODO: get the hostname dynamically
        // TODO: use template for log not concat
        server.log('info', {
          tmpl: 'Realm <%= realmId %> updated - http://localhost:9200/<%= index %>/realm/<%= realmId %>/',
          realmId: arg._id,
          index: arg._index
        });

        reply({status: 'realm updated', link: 'http://localhost:9200/'+arg._index+'/realm/'+arg._id+'/'});
      })
      .catch(function(err){
        console.log(err);
      });
    }
  });

  return server;
}
