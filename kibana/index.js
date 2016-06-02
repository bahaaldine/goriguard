var Promise = require('bluebird');
var goriguardRoutes = require('./server/routes/api');
var ensureIndexTemplate = require('./server/lib/ensure_index_template');
var ensureStatIndexTemplate = require('./server/lib/ensure_stat_index_template');
var ensureIndexCreation = require('./server/lib/ensure_index_creation');
var ensureDashboards = require('./server/lib/ensure_dashboards');
var handleStatsEvent = require('./server/lib/handle_stats_event.js');

module.exports = function (kibana) {
  return new kibana.Plugin({

    name: 'goriguard',
    require: ['kibana', 'elasticsearch'],
    uiExports: {
      app: {
        title: 'goriguard',
        description: 'Look at your face, this is your data ...',
        main: 'plugins/goriguard/app',
        icon: 'plugins/goriguard/goriguard-mini.png',
        injectVars: function (server, options) {
          var config = server.config();
          return {
            kbnIndex: config.get('kibana.index'),
            esApiVersion: config.get('elasticsearch.apiVersion'),
            esShardTimeout: config.get('elasticsearch.shardTimeout')
          };
        }
      }
    },

    config: function (Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
        indexPattern: Joi.string().default('goriguard'),
        indexStatPattern: Joi.string().default('[goriguard-]YYYY.MM.DD'),
        allStatIndices: Joi.string().default('goriguard-*'),
        faceStatusCreated: Joi.string().default('Ready to run'),
        faceStatusRunning: Joi.string().default('Running'),
        faceStatusStopped: Joi.string().default('Stopped')
      }).default();
    },

    init: function (server, options) {
      var plugin = this;
      var statEventHandler = handleStatsEvent(server);
      // Add server routes and initalize the plugin here
      goriguardRoutes(server);
      plugin.status.yellow('Waiting for Elasticsearch');
      var monitor = server.plugins.good.monitor;
      server.plugins.elasticsearch.status.on('green', function () {
        Promise.try(ensureIndexTemplate(server))
          .then(ensureStatIndexTemplate(server))
          .then(ensureDashboards(server))
          .then(ensureIndexCreation(server))
          .then(function (arg) {
            server.on('stat', statEventHandler);
            plugin.status.green('Ready.'); 
          })
          .catch(console.log.bind(console));
      });
    }

  });
};

