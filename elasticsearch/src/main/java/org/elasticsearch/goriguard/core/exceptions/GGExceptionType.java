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

package org.elasticsearch.goriguard.core.exceptions;

/**
 * Exception type description
 * @param <T> Exception type
 */
public class GGExceptionType<T extends GGException> {
  GGServiceResponse response;
  String message;
  String code;

  /**
   * Class constructor
   * @param type Exception type
   * @param code Exception code
   * @param message Formatting message
   */
  public GGExceptionType(Class<T> type, int code, String message) {
    this.message = message;
    this.code = type.getSimpleName() + '.' + code;
  }

  /**
   * Class constructor
   * @param type Exception type
   * @param code Exception code
   * @param response Associated response
   * @param message Formatting message
   */
  public GGExceptionType(Class<T> type, int code, GGServiceResponse response, String message) {
    this(type, code, message);
    this.response = response;
  }

  /**
   * Get the exception code
   * @return Exception code
   */
  public String getCode() {
    return code;
  }

}
