package org.elasticsearch.goriguard.realm;

public class ESHit<T> {
	private String _index;
	private String _type;
	private String _id;
	private String _score;
	private String _version;
	private boolean found;
	private T _source;
	
	public ESHit() {
		
	}

	public ESHit(String _index, String _type, String _id, T _source) {
		super();
		this._index = _index;
		this._type = _type;
		this._id = _id;
		this.set_source(_source);
	}

	public String get_index() {
		return _index;
	}

	public void set_index(String _index) {
		this._index = _index;
	}

	public String get_type() {
		return _type;
	}

	public void set_type(String _type) {
		this._type = _type;
	}

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String get_score() {
		return _score;
	}

	public void set_score(String _score) {
		this._score = _score;
	}

	public T get_source() {
		return _source;
	}

	public void set_source(T _source) {
		this._source = _source;
	}

	public String get_version() {
		return _version;
	}

	public void set_version(String _version) {
		this._version = _version;
	}

	public boolean isFound() {
		return found;
	}

	public void setFound(boolean found) {
		this.found = found;
	}
}
