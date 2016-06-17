var Promise = require('bluebird'),
	  helper = require('./helper');

module.exports = function (server) {
  
  server.route({
    path: '/goriguard/realms',
    method: 'PUT',
    handler: function (request, reply) {
      var realms = request.payload;

      if ( !realms ) {
        reply({status: "error", message: "missing realms"})
      }

      Promise.try(helper.deleteRealmsById(server, realms))
      .then(function(response){
        reply(response);
      });
    }
  });

  return server;
}
