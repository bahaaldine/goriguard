package org.elasticsearch.goriguard.realm;

public class GoriguardRealm extends TimeTrackedObject {
	private String name;
	private String type;
	private String key;
	
	public GoriguardRealm() {
		
	}
	
	public GoriguardRealm(String name, String type) {
		super();
		this.name = name;
		this.type = type;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
