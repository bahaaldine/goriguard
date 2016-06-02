package org.elasticsearch.goriguard.framework.log;

/**
 * Log
 */
public class Log {
	LogLevel level;
	String message;

	/**
	 * Class constructor
	 * @param level Log level
	 * @param message Log message
	 */
	public Log(LogLevel level, String message) {
		this.level = level;
		this.message = message;
	}

}
