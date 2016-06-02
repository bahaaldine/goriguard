package org.elasticsearch.goriguard.realm;

public class CreateSessionRequest {
	private String email;
	private String token;
	
	public CreateSessionRequest() {
		
	}

	public CreateSessionRequest(String email, String token) {
		super();
		this.setEmail(email);
		this.setToken(token);
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	
}
