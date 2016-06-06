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

package org.elasticsearch.goriguard.framework.serialization;

import org.elasticsearch.goriguard.core.exceptions.GGException;
import org.elasticsearch.goriguard.core.exceptions.GGExceptionType;

/**
 * Serialization related exception
 */
public class SerializationException  extends GGException implements SerializationExceptionTypes {
  private static final long serialVersionUID = -1271783407350682447L;

  /**
   * Class constructor
   * @param type Exception type
   * @param parameters Message parameters
   */
  public SerializationException(GGExceptionType<SerializationException> type, Object... parameters) {
    super(type, parameters);
  }

  /**
   * Class constructor
   * @param type Exception type
   * @param cause Exception cause
   * @param parameters Message parameters
   */
  public SerializationException(GGExceptionType<SerializationException> type, Throwable cause, Object... parameters) {
    super(type, cause, parameters);
  }


}
