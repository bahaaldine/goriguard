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
