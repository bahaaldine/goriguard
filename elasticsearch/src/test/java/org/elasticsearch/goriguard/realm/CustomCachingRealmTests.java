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

import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.goriguard.realm.CustomCachingRealm;
import org.elasticsearch.goriguard.realm.CustomRealm;
import org.elasticsearch.shield.User;
import org.elasticsearch.shield.authc.RealmConfig;
import org.elasticsearch.shield.authc.support.SecuredString;
import org.elasticsearch.shield.authc.support.UsernamePasswordToken;
import org.elasticsearch.test.ESTestCase;
import org.junit.Test;

import static org.hamcrest.Matchers.*;

/**
 * Unit tests for the CustomCachingRealm
 */
public class CustomCachingRealmTests extends ESTestCase {

    @Test
    public void testAuthenticateWithCachedValue() {
        //setup
        Settings globalSettings = Settings.builder().put("path.home", createTempDir()).build();
        Settings realmSettings = Settings.builder()
                .put("type", CustomRealm.TYPE)
                .put("users.john.password", "doe")
                .put("users.john.roles", "user")
                .build();
        CustomCachingRealm realm = new CustomCachingRealm(new RealmConfig("test", realmSettings, globalSettings));

        // authenticate john
        UsernamePasswordToken token = new UsernamePasswordToken("john", new SecuredString(new char[] { 'd', 'o', 'e'}));
        final User user = realm.authenticate(token);
        assertThat(user, notNullValue());
        assertThat(user.roles(), arrayContaining("user"));
        assertThat(user.principal(), equalTo("john"));

        // authenticate john again and we should be returned the same user object
        User user1 = realm.authenticate(token);
        assertThat(user1, sameInstance(user));

        // modify the cache entry with a changed password
        CustomCachingRealm.UserHolder holder = new CustomCachingRealm.UserHolder("changed".toCharArray(), user);
        realm.putInCache("john", holder);

        // try to authenticate again with the old password
        user1 = realm.authenticate(token);
        assertThat(user1, nullValue());

        // authenticate with new password
        token = new UsernamePasswordToken("john", new SecuredString("changed".toCharArray()));
        user1 = realm.authenticate(token);
        assertThat(user1, sameInstance(user));

        // clear the cache
        if (randomBoolean()) {
            realm.expire("john");
        } else {
            realm.expireAll();
        }

        // authenticate with new password shouldn't work
        user1 = realm.authenticate(token);
        assertThat(user1, nullValue());

        // authenticate with correct password should work
        token = new UsernamePasswordToken("john", new SecuredString(new char[] { 'd', 'o', 'e'}));
        user1 = realm.authenticate(token);
        assertThat(user1, not(nullValue()));
        assertThat(user1, not(sameInstance(user)));
        assertThat(user1, equalTo(user));
    }
}
