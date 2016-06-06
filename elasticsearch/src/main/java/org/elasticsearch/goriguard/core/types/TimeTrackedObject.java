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

import org.joda.time.DateTime;

/**
 * Time tracked object
 */
public class TimeTrackedObject {
  protected DateTime created;
  protected DateTime updated;
  protected DateTime deleted;

  /**
   * Get the creation time
   * @return Creation time
   */
  public DateTime getCreationTime() {
    return created;
  }

  /**
   * Set the creation time
   * @param creationTime Creation time
   */
  public void setCreationTime(DateTime creationTime) {
    this.created = creationTime;
  }

  /**
   * Get the update time
   * @return Update time
   */
  public DateTime getUpdateTime() {
    return updated;
  }

  /**
   * Set the update time
   * @param updateTime Update time
   */
  public void setUpdateTime(DateTime updateTime) {
    this.updated = updateTime;
  }

  /**
   * Get the deletion time
   * @return Deletion time
   */
  public DateTime getDeletionTime() {
    return deleted;
  }

  /**
   * Set the deletion time
   * @param deletionTime Deletion time
   */
  public void setDeletionTime(DateTime deletionTime) {
    this.deleted = deletionTime;
  }

  /**
   * Test whether an object is deleted
   * @return true if deleted
   */
  public boolean isDeleted() {
    return deleted != null;
  }
}
