var _ = require('lodash'),
    moment = require('moment');

module.exports.createRealm = function (server, req, realmId) {
	var client = server.plugins.elasticsearch.client;
  var config = server.config();
	var index = config.get('goriguard.indexPattern');
    
    var name = req.payload.name;
    var type = req.payload.type;

    return function() {
    	return client.index({
    		id: realmId,
            index: index,
            type: 'realm',
            body: {
                name: name,
                type: type,
                created: moment.utc().toISOString()
            }
        });
    }
}

module.exports.deleteRealmsById = function (server, realms) {
    var client = server.plugins.elasticsearch.client;
  var config = server.config();
    var index = config.get('goriguard.indexPattern');

  return function() {   
    var bulkArray = [];

    _.forEach(realms, function(realm) {
        var updateQuery = { update : {_id : realm._id, _type : "realm", "_index" : index} };
        var body = { doc : { deleted : moment.utc().toISOString() } };

        bulkArray.push(updateQuery);
        bulkArray.push(body);
    });

    var request = { 
            body: bulkArray
        };
        
        return client.bulk(request);
  }
}

module.exports.getRealmById = function (server, req) {
    var client = server.plugins.elasticsearch.client;
    var config = server.config();
    var index = config.get('goriguard.indexPattern');

    var realmId = req.params.realmId;

    return function() {
        return client.get({
            id: realmId,
            index: index,
            type: 'realm'
        });
    }
}

module.exports.getRealms = function (server, req) {
    var client = server.plugins.elasticsearch.client;
  var config = server.config();
    var index = config.get('goriguard.indexPattern');
  
  return function() {
    var request = { 
      index: index,
      type: 'realm',
      body: {
        query: {
          constant_score: {
            filter: {
              missing: {
                field: "deleted"
              }
            }
          }
        },
        sort: sort
      }
    };

    var query = req.query.query;
    if ( typeof query != "undefined" && query.length > 0 ) {
      request.body.query = {
        bool: {
          must: [
            {
              match_phrase_prefix: {
                name: {
                  query : query
                }
              }
            },
            {
              constant_score: {
                filter: {
                  missing: {
                    field: "deleted"
                  }
                }
              }
            }
          ]
        }
      };
    }

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

module.exports.updateRealm = function (server, req) {
    var client = server.plugins.elasticsearch.client;
    var config = server.config();
    var index = config.get('goriguard.indexPattern');
    
    var realmId = req.payload.realmId;
    var name = req.payload.name;
    var type = req.payload.type;

    return function() {
        return client.update({
            id: realmId,
            index: index,
            type: 'realm',
            body: {
                doc: {
                    name: name,
                    type: type,
                    updated: moment.utc().toISOString()
                }
            }
        });
    }
}