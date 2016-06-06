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

package org.elasticsearch.goriguard.framework.configuration;

import org.elasticsearch.goriguard.framework.log.Log;
import org.elasticsearch.goriguard.framework.log.LogLevel;

/**
 * Configuration logs dictionary
 */
public interface ConfigurationLogs {

  Log CONFIGURATION_LOADED      = new Log(LogLevel.INFO, "Configuration file {} loaded");
  Log CONFIGURATION_LOADED_DEFAULTS  = new Log(LogLevel.INFO, "Configuration file {} not found, using defaults");
  Log CONFIGURATION_LOAD_FAILED    = new Log(LogLevel.INFO, "Configuration file {} failed to load, using defaults\nReason: {}");

}
