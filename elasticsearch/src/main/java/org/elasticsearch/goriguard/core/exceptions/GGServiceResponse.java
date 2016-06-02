package org.elasticsearch.goriguard.core.exceptions;

/**
 * Service response HTTP code
 */
public enum GGServiceResponse {
	OK(200),
	FOUND(200),
	AUTHENTICATION_ERROR(401),
	LOGIC_ERROR(403),
	NOT_FOUND(404),
	GENERIC_ERROR(503);

	private int code;

	/**
	 * Enum constructor
	 * @param code Code
	 */
	private GGServiceResponse(int code) {
		this.code = code;
	}

	/**
	 * Get the code
	 * @return Code
	 */
	public int getCode() {
		return code;
	}

}
