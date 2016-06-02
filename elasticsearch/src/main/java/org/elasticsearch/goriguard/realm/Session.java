package org.elasticsearch.goriguard.realm;

import java.util.ArrayList;
import java.util.List;

public class Session extends TimeTrackedObject {
	private String email;
	private String created;
	private List<String> roles;
	
	public Session() {
		
	}

	public Session(String email, String created) {
		this.email = email;
		this.created = created;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}


	public String getCreated() {
		return created;
	}


	public void setCreated(String created) {
		this.created = created;
	}

	public List<String> getRoles() {
		if ( this.roles == null ) {
			return new ArrayList<String>();
		}
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
}
