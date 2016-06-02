var _ = require('lodash'),
moment = require('moment');

module.exports.createRole = function (server, req, roleId) {
	var client = server.plugins.elasticsearch.client;
  var config = server.config();
	var index  = config.get('goriguard.indexPattern');
    
  var realmId      = req.params.realmId;

  var name         = req.payload.name;
  var description  = req.payload.description;

  return function() {
  	return client.index({
  		id: roleId,
      index: index,
      type: 'role',
      body: {
        name: name,
        description: description,
        realm_id: realmId,
        created: moment.utc().toISOString()
      }
    });
  }
}

module.exports.deleteRolesById = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');

  var roles = req.payload;

  return function() {   
    var bulkArray = [];

    _.forEach(roles, function(role) {
      var updateQuery = { update : {_id : role._id, _type : "role", "_index" : index} };
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

module.exports.getRoles = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');
  
  var realmId = req.params.realmId;

  return function() {
    var request = { 
      index: index,
      type: 'role',
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

    var name = req.query.name;
    if ( typeof name != "undefined" && name.length > 0 ) {
      request.body.query = {
        bool: {
          must: [
            {
              match_phrase_prefix: {
                name: {
                  query : name
                }
              }
            },
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

module.exports.updateRole = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index  = config.get('goriguard.indexPattern');
  
  var realmId      = req.params.realmId;

  var roleId       = req.payload.roleId;
  var name         = req.payload.name;
  var description  = req.payload.description;

  return function() {
    return client.update({
      id: roleId,
      index: index,
      type: 'role',
      body: {
        doc: {
          name: name,
          description: description,
          updated: moment.utc().toISOString()
        }
      }
    });
  }
}

module.exports.getRoleById = function (server, req) {
    var client = server.plugins.elasticsearch.client;
    var config = server.config();
    var index = config.get('goriguard.indexPattern');

    var realmId = req.params.realmId;
    var roleId = req.params.roleId;

    return function() {
      return client.search({
        index: index,
        type: 'role',
        body: {
          query: {
            bool: {
              must: [
              {
                term: {
                  _id: {
                    value: roleId
                  }
                }
              },
              {
                term: {
                  realm_id: {
                    value: realmId
                  }
                }
              }
            ]
          }
        }
      }
    });
  }
}