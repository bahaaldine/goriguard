package org.elasticsearch.goriguard.framework.serialization;

import org.elasticsearch.goriguard.core.exceptions.GGExceptionType;

/**
 * Serialization exception dictionary
 */
public interface SerializationExceptionTypes {

	GGExceptionType<SerializationException> MARSHALLING_FAILED		= new GGExceptionType<SerializationException>(SerializationException.class, 1, "marshalling failed for type {0}");
	GGExceptionType<SerializationException> UNMARSHALLING_FAILED	= new GGExceptionType<SerializationException>(SerializationException.class, 2, "unmarshalling failed for type {0}");

}
