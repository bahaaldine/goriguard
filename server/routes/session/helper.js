var moment = require('moment');

module.exports.createSession = function (server, req, sessionId) {
	var client = server.plugins.elasticsearch.client;
  var config = server.config();
	var index = config.get('goriguard.indexPattern');
    
  var realmId = req.params.realmId;
  var email   = req.payload.email;

  return function() {
  	return client.index({
      id: sessionId,
      index: index,
      type: 'session',
      body: {
        email: email,
        created: moment.utc().toISOString()
      }
    }).then(function() {
      return client.get({
        id: sessionId,
        index: index,
        type: 'session'
      });
    });
  }
}

module.exports.getUserByEmailAndToken = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');
  
  var realmId = req.params.realmId;
  var email   = req.payload.email;
  var token   = req.payload.token;

  return function() {
    var request = { 
      index: index,
      type: 'user',
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  realm_id: {
                    value: realmId
                  }
                }
              },
              {
                term: {
                  email: {
                    value: email
                  }
                }
              },
              {
                term: {
                  token: {
                    value: token
                  }
                }
              }
            ]
          }
        }
      }
    };

    return client.search(request);
  }
}

module.exports.getSessions = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');
  
  var realmId = req.params.realmId;

  return function() {
    var request = { 
      index: index,
      type: 'session',
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  realm_id: {
                    value: realmId
                  }
                }
              }
            ], 
            must_not: {
              exists: {
                field: "deleted"
              }
            }
          }
        }
      }
    };

    var pageSize = req.query.pageSize;
    if ( typeof pageSize != "undefined" ) {
      request.body.size = pageSize;
    }

    var offset = req.query.offset;
    if ( typeof offset != "undefined" ) {
      request.body.from = offset;
    }

    var orderBy = req.query.orderBy;
    var order = req.query.order;  
    if ( typeof orderBy != "undefined" 
      && typeof order != "undefined" ) {

      var sort = {};
      sort[orderBy] = {
        order: order
      }

      request.body.sort = sort;
    }

    return client.search(request);
  }
}