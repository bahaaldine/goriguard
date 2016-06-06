/*
 * Licensed to Elasticsearch under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
