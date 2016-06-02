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
