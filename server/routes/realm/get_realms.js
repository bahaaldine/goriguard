var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
    server.route({
    path: '/goriguard/realms',
    method: 'GET',
    handler: function (req, reply) {
      Promise.try(helper.getRealms(server, req))
      .then(function(realms) {
        reply(realms.hits);
      }).catch(function(err){
        console.log(err);
      });
    }
  });


  return server;
}
