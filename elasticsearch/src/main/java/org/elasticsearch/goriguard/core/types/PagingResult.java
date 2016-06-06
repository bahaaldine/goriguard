/*
 * Licensed to Elasticsearch under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
