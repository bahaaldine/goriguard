var _ = require('lodash');
var moment = require('moment');
module.exports = function (server) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();

  return function (event) {
    var facechimpIndex = config.get('facechimp.indexPattern');
    var statIndex = moment.utc().format(config.get('facechimp.indexStatPattern'));
    var payload = _.cloneDeep(event);

    return client.index({
      index: statIndex,
      type: 'stat',
      body: payload
    });
  }
};
