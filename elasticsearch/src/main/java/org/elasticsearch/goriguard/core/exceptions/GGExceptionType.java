package org.elasticsearch.goriguard.core.exceptions;



/**
 * Exception type description
 * @param <T> Exception type
 */
public class GGExceptionType<T extends GGException> {
	GGServiceResponse response;
	String message;
	String code;

	/**
	 * Class constructor
	 * @param type Exception type
	 * @param code Exception code
	 * @param message Formatting message
	 */
	public GGExceptionType(Class<T> type, int code, String message) {
		this.message = message;
		this.code = type.getSimpleName() + '.' + code;
	}

	/**
	 * Class constructor
	 * @param type Exception type
	 * @param code Exception code
	 * @param response Associated response
	 * @param message Formatting message
	 */
	public GGExceptionType(Class<T> type, int code, GGServiceResponse response, String message) {
		this(type, code, message);
		this.response = response;
	}

	/**
	 * Get the exception code
	 * @return Exception code
	 */
	public String getCode() {
		return code;
	}

}
