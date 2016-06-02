package org.elasticsearch.goriguard.framework.configuration;

import org.elasticsearch.goriguard.framework.log.Log;
import org.elasticsearch.goriguard.framework.log.LogLevel;

/**
 * Configuration logs dictionary
 */
public interface ConfigurationLogs {

	Log CONFIGURATION_LOADED			= new Log(LogLevel.INFO, "Configuration file {} loaded");
	Log CONFIGURATION_LOADED_DEFAULTS	= new Log(LogLevel.INFO, "Configuration file {} not found, using defaults");
	Log CONFIGURATION_LOAD_FAILED		= new Log(LogLevel.INFO, "Configuration file {} failed to load, using defaults\nReason: {}");

}
