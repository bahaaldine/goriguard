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

package org.elasticsearch.goriguard.framework.cryptography;

import org.elasticsearch.goriguard.core.exceptions.GGExceptionType;

/**
 * Serialization exception dictionary
 */
public interface CryptographyExceptionTypes {

  GGExceptionType<CryptographyException> INVALID_TOKEN        = new GGExceptionType<CryptographyException>(CryptographyException.class, 1, "invalid token {0}");
  GGExceptionType<CryptographyException> EXPIRED_TOKEN        = new GGExceptionType<CryptographyException>(CryptographyException.class, 2, "token has expired {0}");
  GGExceptionType<CryptographyException> TOKEN_DECRYPTION_ERROR    = new GGExceptionType<CryptographyException>(CryptographyException.class, 3, "error occured while decrypting token");
}
