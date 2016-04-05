var Promise = require('bluebird');
var dashboardsAndVisualizations = require('./json/dashboard_and_visualizations.json');
module.exports = function (server) {
  var client = server.plugins.elasticsearch.client;
  var config = server.config();
  var index = config.get('kibana.index');
  var id = 'Facechimp-Search-Stats';
  var type = 'dashboard';
  return function () {
    return client.get({
      index: index,
      type: type,
      id: id,
      ignoreUnavailable: true
    })
    .catch(function (resp) {
      if (resp.status !== 404) return Promise.reject(resp);
      return Promise.each(dashboardsAndVisualizations, function (doc) {
        return client.create({
          index: index,
          type: doc._type,
          id: doc._id,
          body: doc._source,
          ignore: [409]
        });
      });
    });
  }
}
