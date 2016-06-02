package org.elasticsearch.goriguard.framework.cryptography;

import org.elasticsearch.goriguard.core.exceptions.GGException;
import org.elasticsearch.goriguard.core.exceptions.GGExceptionType;

/**
 * Serialization related exception
 */
public class CryptographyException  extends GGException implements CryptographyExceptionTypes {
	private static final long serialVersionUID = -1271783407350682447L;

	/**
	 * Class constructor
	 * @param type Exception type
	 * @param parameters Message parameters
	 */
	public CryptographyException(GGExceptionType<CryptographyException> type, Object... parameters) {
		super(type, parameters);
	}

	/**
	 * Class constructor
	 * @param type Exception type
	 * @param cause Exception cause
	 * @param parameters Message parameters
	 */
	public CryptographyException(GGExceptionType<CryptographyException> type, Throwable cause, Object... parameters) {
		super(type, cause, parameters);
	}


}
