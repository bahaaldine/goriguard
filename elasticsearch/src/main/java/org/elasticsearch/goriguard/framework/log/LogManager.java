package org.elasticsearch.goriguard.framework.log;

import org.slf4j.LoggerFactory;

/**
 * Logger manager
 */
public class LogManager {
	private static final LogManager INSTANCE = new LogManager();

	/**
	 * Retrieve the logger manager's singleton instance
	 * @return Manager instance
	 */
	public static LogManager getInstance() {
		return INSTANCE;
	}

	/**
	 * Class constructor
	 */
	private LogManager() {

	}

	/**
	 * Obtain a logger for a particular type
	 * @param type Type
	 * @return Logger
	 */
	public <T> Logger getLogger(Class<T> type) {
		// TODO: overload with automatic type deduction from callstack
		return new Logger(LoggerFactory.getLogger(type));
	}

}
