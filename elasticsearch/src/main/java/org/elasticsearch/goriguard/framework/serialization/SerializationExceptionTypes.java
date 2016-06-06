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

import org.elasticsearch.goriguard.core.exceptions.GGExceptionType;

/**
 * Serialization exception dictionary
 */
public interface SerializationExceptionTypes {

  GGExceptionType<SerializationException> MARSHALLING_FAILED    = new GGExceptionType<SerializationException>(SerializationException.class, 1, "marshalling failed for type {0}");
  GGExceptionType<SerializationException> UNMARSHALLING_FAILED  = new GGExceptionType<SerializationException>(SerializationException.class, 2, "unmarshalling failed for type {0}");

}
