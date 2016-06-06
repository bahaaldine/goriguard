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

import java.io.UnsupportedEncodingException;
import java.security.AccessController;
import java.security.AllPermission;
import java.security.PrivilegedAction;
import java.security.PrivilegedActionException;
import java.security.PrivilegedExceptionAction;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import org.apache.commons.codec.binary.Base64;
import org.elasticsearch.SpecialPermission;
import org.elasticsearch.goriguard.framework.cryptography.CryptographyManager;
import org.elasticsearch.goriguard.framework.log.LogManager;
import org.elasticsearch.goriguard.framework.log.Logger;
import org.elasticsearch.rest.RestRequest;
import org.elasticsearch.shield.User;
import org.elasticsearch.shield.authc.AuthenticationToken;
import org.elasticsearch.shield.authc.Realm;
import org.elasticsearch.shield.authc.RealmConfig;
import org.elasticsearch.shield.authc.support.SecuredString;
import org.elasticsearch.shield.authc.support.UsernamePasswordToken;
import org.elasticsearch.transport.TransportMessage;

/**
 * A custom {@link Realm} implementation that reads in users, passwords, and
 * roles from the settings defined in the elasticsearch configuration file.
 * Please note, this method of storing authentication data is <b>not secure</b>
 * and is done as an example to demonstrate the workings of a realm in a simple
 * manner.
 *
 * This custom realm also uses a different authentication scheme. The realm will
 * extract a {@link UsernamePasswordToken} that can be used for authentication,
 * but does so in a non standard manner by retrieving the values from a header
 * in the request.
 */
public class CustomRealm extends Realm<UsernamePasswordToken> {

    /*
     * The type of the realm. This is defined as a static final variable to
     * prevent typos
     */
    public static final String TYPE = "goriguard";

    public static final String USER_HEADER = "User";
    public static final String PW_HEADER = "Password";

    private static String GORI_CREATE_SESSION_API = "/goriguard/realm/REALM_ID/session";
    private static String GORI_REALM_KEY;

    private static final Logger LOGGER = LogManager.getInstance().getLogger(CustomRealm.class);

    /**
     * Constructor for the Realm. This constructor delegates to the super class
     * to initialize the common aspects such as the logger.
     * 
     * @param config
     *            the configuration specific to this realm
     */
    public CustomRealm(RealmConfig config) {
        super(TYPE, config);
        this.GORI_CREATE_SESSION_API = this.GORI_CREATE_SESSION_API.replace("REALM_ID",
                config.settings().get("goriguard.realm.id"));
        this.GORI_REALM_KEY = config.settings().get("goriguard.realm.key");
    }

    /**
     * This constructor should be used by extending classes so that they can
     * specify their own specific type
     * 
     * @param type
     *            the type of the realm
     * @param config
     *            the configuration specific to this realm
     */
    protected CustomRealm(String type, RealmConfig config) {
        super(TYPE, config);
        this.GORI_CREATE_SESSION_API = this.GORI_CREATE_SESSION_API.replace("REALM_ID",
                config.settings().get("goriguard.realm.id"));
        this.GORI_REALM_KEY = config.settings().get("goriguard.realm.key");
    }

    /**
     * Indicates whether this realm supports the given token. This realm only
     * support {@link UsernamePasswordToken} objects for authentication
     * 
     * @param token
     *            the token to test for support
     * @return true if the token is supported. false otherwise
     */
    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof UsernamePasswordToken;
    }

    /**
     * This method will extract a token from the given {@link RestRequest} if
     * possible. This implementation of token extraction looks for two headers,
     * the <code>User</code> header for the username and the
     * <code>Password</code> header for the plaintext password
     * 
     * @param request
     *            the rest request to extract a token from
     * @return the {@link AuthenticationToken} if possible to extract or
     *         <code>null</code>
     */
    @Override
    public UsernamePasswordToken token(RestRequest request) {
        String user = request.header(USER_HEADER);
        if (user != null) {
            String password = request.header(PW_HEADER);
            if (password != null) {
                return new UsernamePasswordToken(user, new SecuredString(password.toCharArray()));
            }
        }
        return null;
    }

    /**
     * This method will extract a token from the given {@link TransportMessage}
     * if possible. This implementation of token extraction looks for two
     * headers, the <code>User</code> header for the username and the
     * <code>Password</code> header for the plaintext password
     * 
     * @param message
     *            the message to extract the token from
     * @return the {@link AuthenticationToken} if possible to extract or
     *         <code>null</code>
     */
    @Override
    public UsernamePasswordToken token(TransportMessage<?> message) {
        String user = message.getHeader(USER_HEADER);
        if (user != null) {
            String password = message.getHeader(PW_HEADER);
            if (password != null) {
                byte[] hash = null;
                try {
                    hash = Base64.encodeBase64(CryptographyManager.getInstance()
                            .computeSHA1((user + password + GORI_REALM_KEY).getBytes("UTF-8")));
                    return new UsernamePasswordToken(user, new SecuredString(new String(hash, "UTF-8").toCharArray()));
                } catch (UnsupportedEncodingException e) {
                    // TODO: bubble up exception properly
                }
            }
        }
        return null;
    }

    /**
     * Method that handles the actual authentication of the token. This method
     * will only be called if the token is a supported token. The method
     * validates the credentials of the user and if they match, a {@link User}
     * will be returned
     * 
     * @param token
     *            the token to authenticate
     * @return {@link User} if authentication is successful, otherwise
     *         <code>null</code>
     */
    @Override
    public User authenticate(UsernamePasswordToken token) {
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            // unprivileged code such as scripts do not have SpecialPermission
            sm.checkPermission(new SpecialPermission());
        }

        final Client client;
        // Create a trust manager that does not validate certificate
        // chains
        TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
            }

            public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
            }
        } };

        try {
            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());

            ClientBuilder clientBuilder = AccessController.doPrivileged(new PrivilegedAction<ClientBuilder>() {
                @Override
                public ClientBuilder run() {
                    try {
                        return ClientBuilder.newBuilder();
                    } catch (Exception e) {
                        LOGGER.debug(e.getMessage());
                        return null;
                    }
                }
            });
            client = clientBuilder.sslContext(sc).build();

        } catch (Exception e) {
            return null;
        }

        if (client == null) {
            return null;
        }

        final CreateSessionRequest request = new CreateSessionRequest(token.principal(),
                new String(token.credentials().copyChars()));
        final String create_session_url = config.settings().get("goriguard.url") + GORI_CREATE_SESSION_API;
        
        final WebTarget target = AccessController.doPrivileged(new PrivilegedAction<WebTarget>() {
            @Override
            public WebTarget run() {
                try {
                    return client.target(create_session_url);
                } catch (Exception e) {
                    LOGGER.debug(e.getMessage());
                    return null;
                }
            }
        });
        final WebTarget target2 = target.queryParam("email", request.getEmail()).queryParam("token", request.getToken());
        
        CreateSessionResponse responses = AccessController.doPrivileged(new PrivilegedAction<CreateSessionResponse>() {
            @Override
            public CreateSessionResponse run() {
                try {
                    return target2.request().get(CreateSessionResponse.class);
                } catch (Exception e) {
                    LOGGER.debug(e.getMessage());
                    return null;
                }
            }
        });

        if (responses == null) {
            return null;
        }

        return new User(responses.get_source().getEmail(),
                responses.get_source().getRoles().toArray(new String[responses.get_source().getRoles().size()]));
    }

    /**
     * This method indicates whether this realm supports user lookup or not.
     * User lookup is used for the run as functionality found in Shield.
     * 
     * @return true if lookup is supported, false otherwise
     */
    @Override
    public boolean userLookupSupported() {
        return true;
    }

    /**
     * Class that holds the information about a user
     */
    private static class InfoHolder {
        private final String password;
        private final String[] roles;

        InfoHolder(String password, String[] roles) {
            this.password = password;
            this.roles = roles;
        }
    }

    @Override
    public User lookupUser(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }
}
