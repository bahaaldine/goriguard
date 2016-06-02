package org.elasticsearch.goriguard.framework.configuration;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.elasticsearch.goriguard.framework.log.LogManager;
import org.elasticsearch.goriguard.framework.log.Logger;
import org.elasticsearch.goriguard.framework.serialization.SerializationException;
import org.elasticsearch.goriguard.framework.serialization.SerializationManager;

/**
 * Configuration manager
 */
public class ConfigurationManager {
	private static final String CONFIGURATION_PATH = "conf/";
	private static final String CONFIGURATION_SUFFIX = "Configuration";
	private static final String CONFIGURATION_EXTENSION = ".json";

	private static final Logger LOGGER = LogManager.getInstance().getLogger(ConfigurationManager.class);
	private static final ConfigurationManager INSTANCE = new ConfigurationManager();

	private Map<Class<? extends Configuration>, Configuration> configurations = new HashMap<>();

	/**
	 * Retrieve the configuration manager's singleton instance
	 * @return Manager instance
	 */
	public static ConfigurationManager getInstance() {
		return INSTANCE;
	}

	/**
	 * Class constructor
	 */
	private ConfigurationManager() {

	}

	/**
	 * Get a configuration
	 * @param type Configuration type
	 * @return Configuration
	 */
	public <T extends Configuration> T getConfiguration(Class<T> type) {
		@SuppressWarnings("unchecked")
		T configuration = (T) configurations.get(type);

		if (configuration == null) {
			try {
				String filename = type.getSimpleName();

				filename = CONFIGURATION_PATH + filename.substring(0, filename.length() - CONFIGURATION_SUFFIX.length()).toLowerCase() + CONFIGURATION_EXTENSION;

				InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(filename);

				if (inputStream == null) {
					LOGGER.log(ConfigurationLogs.CONFIGURATION_LOADED_DEFAULTS, filename);
					configuration = type.newInstance();
				} else {
					try {
						configuration = SerializationManager.getInstance().unmarshal(inputStream, type);
						LOGGER.log(ConfigurationLogs.CONFIGURATION_LOADED, filename);
					} catch (SerializationException e) {
						LOGGER.log(ConfigurationLogs.CONFIGURATION_LOAD_FAILED, filename, e.getCause().getMessage());
						configuration = type.newInstance();
					}
				}
				
				configurations.put(type, configuration);
			} catch (InstantiationException | IllegalAccessException e) {
				e.printStackTrace();
			}
		}
		return configuration;
	}

}
