package org.elasticsearch.goriguard.core.exceptions;

import java.text.MessageFormat;


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
		super(MessageFormat.format(type.message, parameters));
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
		super(MessageFormat.format(type.message, parameters), cause);
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
