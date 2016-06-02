package org.elasticsearch.goriguard.framework.cryptography;

import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.security.auth.login.AccountException;

import org.apache.commons.codec.binary.Base64;
import org.joda.time.DateTime;

import org.elasticsearch.goriguard.framework.log.LogManager;
import org.elasticsearch.goriguard.framework.log.Logger;

/**
 * Cryptography manager
 */
public class CryptographyManager {
	private static final String ALGORITHM_SHA1 = "SHA-1";
	private static final String ALGORITHM_SHA256 = "SHA-256";
	private static final String ALGORITHM_AES = "AES";
	private static final String ALGORITHM_HMACSHA1 = "HmacSHA256";
	
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
			e.printStackTrace();
		}
	}

	/**
	 * Compute the SHA-1 hash of an input value
	 * @param input Input value
	 * @return SHA-1 hash
	 */
	public byte[] computeSHA1(byte[] input) {
		LOGGER.debug("From digest : {} - chartset {}", Arrays.toString(input), Charset.defaultCharset().toString());
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
	 * Build an activation hash from user email
	 * @param email
	 * @return activation hash
	 * @throws CryptographyException 
	 */
	public String getHashFromEmail(String email, String salt, boolean encode) throws CryptographyException {
		String value = email + ";" + salt;
		CryptographyManager cryptographyManager = CryptographyManager
				.getInstance();
		byte[] encrypted = cryptographyManager.computeSHA1(value.getBytes());
		byte[] encoded = cryptographyManager.encodeBase64(encrypted);
		if (encode) {
			return getUrlEncodedToken(new String(encoded));
		}
		
		return new String(encoded);
	}

	/**
	 * Encode token to URL
	 * @param token
	 * @return encoded token
	 * @throws CryptographyException 
	 * @throws AccountException
	 */
	private static String getUrlEncodedToken(String token) throws CryptographyException {
		try {
			return URLEncoder.encode(new String(token), "UTF-8");
		} catch (Exception e) {
			throw new CryptographyException(CryptographyException.ACTIVATION_TOKEN_ERROR);
		}
	}
	
	/**
	 * Generate a token
	 * @param userKey
	 * @param secret
	 * @return token
	 * @throws Exception
	 */
	public String generateToken(String userKey, String secret) throws CryptographyException {
        Key key;
        Cipher c;
        byte[] encVal;
		try {
			key = generateKey(secret);
			c = Cipher.getInstance(ALGORITHM_AES);
			c.init(Cipher.ENCRYPT_MODE, key);
			encVal = c.doFinal((userKey+";"+DateTime.now().getMillis()).getBytes());
			String encryptedValue = new String (org.apache.commons.codec.binary.Base64.encodeBase64URLSafe(encVal));
			return encryptedValue;
		} catch (Exception e) {
			e.printStackTrace();
			throw new CryptographyException(CryptographyException.TOKEN_CREATION_ERROR);
		}
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
        	String decryptedValue = new String(decValue);
        	return decryptedValue;
        } catch ( Exception e ) {
        	e.printStackTrace();
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
    	
    	long currentDate = DateTime.now().getMillis();
    	long tokenDate = ( Long.parseLong(tokenCreationTime) + TOKEN_EXPIRATION );
    	if ( currentDate - tokenDate > 0 ) {
    		throw new CryptographyException(CryptographyException.EXPIRED_TOKEN, token);
    	}
    }
    
    /**
     * Signs a profil 
     * @param uid
     * @param secret
     * @return
     * @throws CryptographyException
     */
    public String getSignedUid(String uid, String secret) throws CryptographyException {
      try {
    	SecretKeySpec signingKey = new SecretKeySpec(secret.getBytes(), ALGORITHM_HMACSHA1);
        Mac mac = Mac.getInstance(ALGORITHM_HMACSHA1);
        mac.init(signingKey);
        byte[] hashed = mac.doFinal(uid.getBytes());
        byte[] signed = org.apache.commons.codec.binary.Base64.encodeBase64URLSafe(hashed);
        
        return new String(signed);
      } catch (Exception e) { 
    	  e.printStackTrace();
    	  throw new CryptographyException(CryptographyException.UID_SIGNATURE_ERROR, uid);
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
