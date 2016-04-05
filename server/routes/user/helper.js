var _ = require('lodash'),
    moment = require('moment');

module.exports.createUser = function (server, req, userId) {
	var client = server.plugins.elasticsearch.client;
  var config = server.config();
	var index  = config.get('goriguard.indexPattern');
    
  var realmId  = req.params.realmId;

  var name     = req.payload.name;
  var password = req.payload.password;
  var roles    = req.payload.roles;

  return function() {
  	return client.index({
  		id: userId,
      index: index,
      type: 'user',
      body: {
        name: name,
        password: password,
        roles: roles,
        realm_id: realmId,
        created: moment.utc().toISOString()
      }
    });
  }
}

module.exports.getUsers = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');
  
  var realmId = req.params.realmId;

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
      request.body.query.bool.must.push({
        match_phrase_prefix: {
          name: {
            query : name
          }
        }
      });
    }

    var role = req.query.role;
    if ( typeof role != "undefined" && role.length > 0 ) {
      request.body.query.bool.must.push({
        term: {
          roles: {
            value: role
          }
        }
      });
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

module.exports.updateUser = function (server, req) {
    var client = server.plugins.elasticsearch.client;
    var config = server.config();
    var index = config.get('goriguard.indexPattern');
    
    var userId   = req.payload.userId;
    var name     = req.payload.name;
    var password = req.payload.password;
    var roles    = req.payload.roles;

    console.log({
      id: userId,
      index: index,
      type: 'user',
      body: {
        doc: {
          name: name,
          password: password,
          roles: req.payload.roles,
          updated: moment.utc().toISOString()
        }
      }
    });

    return function() {
      return client.update({
        id: userId,
        index: index,
        type: 'user',
        body: {
          doc: {
            name: name,
            password: password,
            roles: req.payload.roles,
            updated: moment.utc().toISOString()
          }
        }
      });
    }
}

module.exports.getUserById = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');

  var realmId = req.params.realmId;
  var userId = req.params.userId;

  return function() {
    return client.search({
        index: index,
        type: 'user',
        body: {
          query: {
            bool: {
              must: [
              {
                term: {
                  _id: {
                    value: userId
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

module.exports.deleteUsersById = function (server, req) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('goriguard.indexPattern');

  var users   = req.payload;

  return function() {   
    var bulkArray = [];

    _.forEach(users, function(user) {
      var updateQuery = { update : {_id : user._id, _type : "user", "_index" : index} };
      var body = { doc : { deleted : moment.utc().toISOString() } };

      bulkArray.push(updateQuery);
      bulkArray.push(body);
    });

    var request = { 
      body: bulkArray
    };

    console.log(request);
    
    return client.bulk(request);
  }
}