package org.elasticsearch.goriguard.core.types;

/**
 * Paging results
 * @param <T> Result type
 */
public class PagingResult<T> {
	private Long offset;
	private Long pageSize;
	private boolean hasMore;
	private T[] results;

	/**
	 * Class constructor
	 */
	public PagingResult() {

	}

	/**
	 * Class constructor
	 * @param offset Query offset
	 * @param pageSize Query page size
	 * @param hasMore true if more results are available
	 * @param results Results
	 */
	public PagingResult(Long offset, Long pageSize, boolean hasMore, T[] results) {
		this.offset = offset;
		this.pageSize = pageSize;
		this.hasMore = hasMore;
		this.results = results;
	}

	public Long getOffset() {
		return offset;
	}

	public Long getPageSize() {
		return pageSize;
	}

	public boolean hasMore() {
		return this.hasMore;
	}

	public T[] getResults() {
		return results;
	}

}
