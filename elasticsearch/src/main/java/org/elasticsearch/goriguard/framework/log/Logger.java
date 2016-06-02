package org.elasticsearch.goriguard.framework.log;

/**
 * Logger
 */
public class Logger {
	org.slf4j.Logger logger;

	/**
	 * Class constructor
	 * @param logger SLF4J logger
	 */
	Logger(org.slf4j.Logger logger) {
		this.logger = logger;
	}

	/**
	 * Log a message
	 * @param log Message
	 * @param parameters Parameters
	 */
	public void log(Log log, Object ... parameters) {
		switch (log.level) {
		case NONE:
			break;

		case TRACE:
			logger.trace(log.message, parameters);
			break;

		case DEBUG:
			logger.debug(log.message, parameters);
			break;

		case WARN:
			logger.warn(log.message, parameters);
			break;

		case ERROR:
			logger.error(log.message, parameters);
			break;

		case INFO:
			logger.info(log.message, parameters);
			break;
		}
	}

	/**
	 * Temporary log message for development/debugging purpose
	 * @param message Message
	 * @param parameters Parameters
	 */
	public void debug(String message, Object ... parameters) {
		logger.debug(message, parameters);
	}

}
