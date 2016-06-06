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

import java.text.MessageFormat;
import java.util.Locale;


/**
 * Base exception type
 */
public class GGException extends Exception {
  private static final long serialVersionUID = 5437287126925592103L;

  private GGServiceResponse response;
  private String code;

  /**
   * Constructor
   * @param type Exception type
   * @param parameters Message parameters
   */
  public<T extends GGException> GGException(GGExceptionType<T> type, Object... parameters) {
    super(new MessageFormat(type.message, Locale.getDefault()).format(parameters));
    this.response = type.response;
    this.code = type.code;
  }

  /**
   * Constructor
   * @param type Exception type
   * @param cause Exception cause
   * @param parameters Message parameters
   */
  public<T extends GGException> GGException(GGExceptionType<T> type, Throwable cause, Object... parameters) {
    super(new MessageFormat(type.message, Locale.getDefault()).format(parameters));
    this.response = type.response;
    this.code = type.code;
  }

  /**
   * Verify if the exception contains an associated response
   * @return true if the exception contains a response
   */
  public boolean hasResponse() {
    return response != null;
  }

  /**
   * Retrieve the associated response
   * @return Response
   */
  public GGServiceResponse getResponse() {
    return response;
  }

  /**
   * Retrieve the exception code
   * @return Exception code
   */
  public String getCode() {
    return code;
  }

}
