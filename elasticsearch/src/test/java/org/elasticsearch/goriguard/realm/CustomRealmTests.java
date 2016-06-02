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

import static org.hamcrest.Matchers.arrayContaining;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

import org.apache.commons.codec.binary.Base64;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.goriguard.framework.cryptography.CryptographyManager;
import org.elasticsearch.goriguard.realm.CustomRealm;
import org.elasticsearch.shield.User;
import org.elasticsearch.shield.authc.RealmConfig;
import org.elasticsearch.shield.authc.support.SecuredString;
import org.elasticsearch.shield.authc.support.UsernamePasswordToken;
import org.elasticsearch.test.ESTestCase;
import org.junit.Test;

/**
 * Basic unit tests for the CustomRealm
 */
public class CustomRealmTests extends ESTestCase {

    @Test
    public void testAuthenticate() {
        //setup
    	String realmKey = "NmZiNTFmYjM0M2NjM2RmZDNkYjY4OWYyYTNkMGM1MmRiMWUyMTU0ZA==";
    	String email = "bahaaldine@gmail.com";
        String password = "bahaaldine";
        
        byte[] hash = Base64.encodeBase64(CryptographyManager.getInstance().computeSHA1((email+password+realmKey).getBytes()));
    	Settings globalSettings = Settings.builder().put("path.home", createTempDir()).build();
        Settings realmSettings = Settings.builder()
                .put("type", CustomRealm.TYPE)
                .put("goriguard.url", "https://localhost:5601")
                .put("goriguard.realm.id", "80ccb67c-6d30-497c-a47f-f4edfdcb03b2")
                .put("goriguard.realm.key", realmKey)
                .build();
        CustomRealm realm = new CustomRealm(new RealmConfig("test", realmSettings, globalSettings));

        // authenticate bahaaldine
        UsernamePasswordToken token = new UsernamePasswordToken(email, new SecuredString(new String(hash).toCharArray()));
        User user = realm.authenticate(token);
        assertThat(user, notNullValue());
        assertThat(user.roles(), arrayContaining("testOO"));
        assertThat(user.principal(), equalTo("bahaaldine@gmail.com"));
    }

    @Test
    public void testAuthenticateBadUser() {
        Settings globalSettings = Settings.builder().put("path.home", createTempDir()).build();
        Settings realmSettings = Settings.builder()
                .put("type", CustomRealm.TYPE)
                .put("users.john.password", "doe")
                .put("users.john.roles", "user")
                .put("users.jane.password", "test")
                .putArray("users.jane.roles", "user", "admin")
                .build();

        CustomRealm realm = new CustomRealm(new RealmConfig("test", realmSettings, globalSettings));
        UsernamePasswordToken token = new UsernamePasswordToken("john1", new SecuredString(randomAsciiOfLengthBetween(4, 16).toCharArray()));
        User user = realm.authenticate(token);
        assertThat(user, nullValue());
    }
}
