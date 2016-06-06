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

import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base64;
import org.elasticsearch.goriguard.framework.log.LogManager;
import org.elasticsearch.goriguard.framework.log.Logger;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

/**
 * Cryptography manager
 */
public class CryptographyManager {
  private static final String ALGORITHM_SHA1 = "SHA-1";
  private static final String ALGORITHM_SHA256 = "SHA-256";
  private static final String ALGORITHM_AES = "AES";
  
  private static final Logger LOGGER = LogManager.getInstance().getLogger(CryptographyManager.class);
  private static final CryptographyManager INSTANCE = new CryptographyManager();
  
  private static final Long TOKEN_EXPIRATION = 43200000L;

  private MessageDigest digestSHA1;
  
  /**
   * Retrieve the manager's singleton instance
   * @return Manager instance
   */
  public static CryptographyManager getInstance() {
    return INSTANCE;
  }

  /**
   * Class constructor
   */
  private CryptographyManager() {
    try {
      digestSHA1 = MessageDigest.getInstance(ALGORITHM_SHA1);
    } catch (NoSuchAlgorithmException e) {
      LOGGER.debug(e.getMessage());
    }
  }

  /**
   * Compute the SHA-1 hash of an input value
   * @param input Input value
   * @return SHA-1 hash
   */
  public byte[] computeSHA1(byte[] input) {
    return digestSHA1.digest(input);
  }

  /**
   * Encode a byte array using base-64 encoding
   * @param input Input array
   * @return Output array
   */
  public byte[] encodeBase64(byte[] input) {
    return Base64.encodeBase64(input);
  }

  /**
   * Decode a byte array using base-64 encoding
   * @param input Input array
   * @return Output array
   */
  public byte[] decodeBase64(byte[] input) {
    return Base64.decodeBase64(input);
  }

  /**
   * Decrypt a token
   * @param token
   * @param secret
   * @return decrypted token
   * @throws Exception
   */
    public String decryptToken(String token, String secret) throws CryptographyException {
        try {
          Key key = generateKey(secret);
          Cipher c = Cipher.getInstance(ALGORITHM_AES);
          c.init(Cipher.DECRYPT_MODE, key);
          byte[] decordedValue = org.apache.commons.codec.binary.Base64.decodeBase64(token);
          byte[] decValue = c.doFinal(decordedValue);
          String decryptedValue = new String(decValue, "UTF-8");
          return decryptedValue;
        } catch ( Exception e ) {
          LOGGER.debug(e.getMessage());
          throw new CryptographyException(CryptographyException.TOKEN_DECRYPTION_ERROR);
        }
    }
    
    /**
     * Validate an API token
     * @param token
     * @param userKey
     * @param secret
     * @throws CryptographyException
     */
    public void validateToken(String token, String userKey, String secret) throws CryptographyException {
      String decryptedValue = decryptToken(token, secret);
      String decryptedUserKey = decryptedValue.split(";")[0];
      String tokenCreationTime = decryptedValue.split(";")[1];
      
      if ( !decryptedUserKey.equals(userKey) ) {
        throw new CryptographyException(CryptographyException.INVALID_TOKEN, token);
      }
      
      long currentDate = DateTime.now(DateTimeZone.UTC).getMillis();
      long tokenDate = ( Long.parseLong(tokenCreationTime) + TOKEN_EXPIRATION );
      if ( currentDate - tokenDate > 0 ) {
        throw new CryptographyException(CryptographyException.EXPIRED_TOKEN, token);
      }
    }
    
    /**
     * Create a random unique identifier
     * @return unique identifier
     */
    public String getUid() {
      return UUID.randomUUID().toString().replaceAll("-", "");
    }

    
    /**
     * Generate a secret key hash
     * @param secret
     * @return
     * @throws Exception
     */
    private static Key generateKey(String secret) throws Exception {
      byte[] key = (secret).getBytes("UTF-8");
      MessageDigest sha = MessageDigest.getInstance(ALGORITHM_SHA256);
      key = sha.digest(key);
      key = Arrays.copyOf(key, 16);

      SecretKeySpec secretKeySpec = new SecretKeySpec(key, ALGORITHM_AES);
      return secretKeySpec;
}

    /**
     * Get Access Token expiration time
     * @return token expiration time
     */
  public Long getTokenExpirationTime() {
    return TOKEN_EXPIRATION;
  }

}
