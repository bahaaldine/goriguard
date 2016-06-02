package org.elasticsearch.goriguard.realm;

public class ESResponse<T> {
	private int total;
	private int max_score;
	private String _index;
	private String _type;
	private ESHit<T>[] hits;
	
	public ESResponse() {
		
	}
	
	public ESResponse(int total, int max_score, ESHit<T>[] hits, String _index, String _type) {
		this.total = total;
		this.max_score = max_score;
		this.hits = hits;
		this._index = _index;
		this.set_type(_type);
	}

	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getMax_score() {
		return max_score;
	}
	public void setMax_score(int max_score) {
		this.max_score = max_score;
	}
	public ESHit<T>[] getHits() {
		return hits;
	}
	public void setHits(ESHit<T>[] hits) {
		this.hits = hits;
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
}
