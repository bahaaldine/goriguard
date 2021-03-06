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
 * Service response HTTP code
 */
public enum GGServiceResponse {
  OK(200),
  FOUND(200),
  AUTHENTICATION_ERROR(401),
  LOGIC_ERROR(403),
  NOT_FOUND(404),
  GENERIC_ERROR(503);

  private int code;

  /**
   * Enum constructor
   * @param code Code
   */
  private GGServiceResponse(int code) {
    this.code = code;
  }

  /**
   * Get the code
   * @return Code
   */
  public int getCode() {
    return code;
  }

}
