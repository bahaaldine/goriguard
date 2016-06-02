package org.elasticsearch.goriguard.framework.cryptography;

import org.elasticsearch.goriguard.core.exceptions.GGExceptionType;

/**
 * Serialization exception dictionary
 */
public interface CryptographyExceptionTypes {

	GGExceptionType<CryptographyException> ACTIVATION_TOKEN_ERROR		= new GGExceptionType<CryptographyException>(CryptographyException.class, 1, "error while creating activation token");
	GGExceptionType<CryptographyException> INVALID_TOKEN				= new GGExceptionType<CryptographyException>(CryptographyException.class, 2, "invalid token {0}");
	GGExceptionType<CryptographyException> EXPIRED_TOKEN				= new GGExceptionType<CryptographyException>(CryptographyException.class, 3, "token has expired {0}");
	GGExceptionType<CryptographyException> TOKEN_CREATION_ERROR		= new GGExceptionType<CryptographyException>(CryptographyException.class, 4, "error occured while creation token");
	GGExceptionType<CryptographyException> TOKEN_DECRYPTION_ERROR		= new GGExceptionType<CryptographyException>(CryptographyException.class, 5, "error occured while decrypting token");
	GGExceptionType<CryptographyException> UID_SIGNATURE_ERROR		= new GGExceptionType<CryptographyException>(CryptographyException.class, 6, "error while signing uid {0}");
}
