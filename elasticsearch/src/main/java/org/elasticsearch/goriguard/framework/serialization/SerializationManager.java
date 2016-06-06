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

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.introspect.VisibilityChecker;
import com.fasterxml.jackson.datatype.joda.JodaModule;

/**
 * Serialization manager
 */
public class SerializationManager {
  private static final SerializationManager INSTANCE = new SerializationManager();

  private ObjectMapper objectMapper;

  /**
   * Retrieve the serialization manager's singleton instance
   * @return Manager instance
   */
  public static SerializationManager getInstance() {
    return INSTANCE;
  }

  /**
   * Class constructor
   */
  private SerializationManager() {
    objectMapper = new ObjectMapper();

    VisibilityChecker<?> visibilityChecker = objectMapper.getSerializationConfig().getDefaultVisibilityChecker()
        .withFieldVisibility(JsonAutoDetect.Visibility.ANY)
        .withGetterVisibility(JsonAutoDetect.Visibility.NONE)
        .withIsGetterVisibility(JsonAutoDetect.Visibility.NONE)
        .withSetterVisibility(JsonAutoDetect.Visibility.NONE)
        .withCreatorVisibility(JsonAutoDetect.Visibility.NONE);

    objectMapper.registerModule(new JodaModule());
    objectMapper.configure(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    objectMapper.configure(SerializationFeature.WRITE_NULL_MAP_VALUES, false);
    objectMapper.setSerializationInclusion(Include.NON_NULL);
    objectMapper.setVisibilityChecker(visibilityChecker);
    objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
  }

  /**
   * Retrieve the object mapper used for marshalling and unmarshalling
   * @return Object mapper
   */
  public ObjectMapper getMapper() {
    return objectMapper;
  }

  /**
   * Marshal an object to a string
   * @param object Object
   * @return Marshalled object
   * @throws SerializationException
   */
  public <T> String marshalToString(T object) throws SerializationException {
    try {
      return objectMapper.writeValueAsString(object);
    } catch (JsonProcessingException e) {
      throw new SerializationException(SerializationException.MARSHALLING_FAILED, e, object.getClass());
    }
  }

  /**
   * Marshal an object to an array of bytes
   * @param object Object
   * @return Marshalled object
   * @throws SerializationException
   */
  public <T> byte[] marshalToBytes(T object) throws SerializationException {
    try {
      return objectMapper.writeValueAsBytes(object);
    } catch (JsonProcessingException e) {
      throw new SerializationException(SerializationException.MARSHALLING_FAILED, e, object.getClass());
    }
  }

  /**
   * Marshal an object to an output stream
   * @param object Object
   * @param outputStream Output stream
   * @throws SerializationException
   */
  public <T> void marshal(T object, OutputStream outputStream) throws SerializationException {
    try {
      objectMapper.writeValue(outputStream, object);
    } catch (IOException e) {
      throw new SerializationException(SerializationException.MARSHALLING_FAILED, e, object.getClass());
    }
  }

  /**
   * Unmarshal an object from a string 
   * @param value
   * @param type
   * @return Unmarshalled object
   * @throws SerializationException
   */
  public <T> T unmarshal(String value, Class<T> type) throws SerializationException {
      try {
        return objectMapper.readValue(value, type);
      } catch (IOException e) {
        throw new SerializationException(SerializationException.UNMARSHALLING_FAILED, e, type);
      }
    }


  /**
   * Unmarshal an object from a byte array 
   * @param value Byte array representation
   * @param type Object type
   * @return Unmarshalled object
   * @throws SerializationException
   */
  public <T> T unmarshal(byte[] value, Class<T> type) throws SerializationException {
    try {
      return objectMapper.readValue(value, type);
    } catch (IOException e) {
      throw new SerializationException(SerializationException.UNMARSHALLING_FAILED, e, type);
    }
  }

  /**
   * Unmarshal an object from an input stream 
   * @param input Input stream
   * @param type Object type
   * @return Unmarshalled object
   * @throws SerializationException
   */
  public <T> T unmarshal(InputStream input, Class<T> type) throws SerializationException {
    try {
      return objectMapper.readValue(input, type);
    } catch (IOException e) {
      throw new SerializationException(SerializationException.UNMARSHALLING_FAILED, e, type);
    }
  }

}
