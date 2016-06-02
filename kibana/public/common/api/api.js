require('ui/modules')
	.get('app/goriguard')
	.service('goriguardApiService', ['$http', '$q', function ($http, $q) {


		var getRealm = function(realmId) {
			return $http.get('/goriguard/realm/' + realmId );
		}

		var getRealms = function(listQuery) {
			var url = '/goriguard/realms';

			if ( angular.isDefined(listQuery) ) {
				url += '?pageSize='+listQuery.pageSize+'&offset='+listQuery.offset;
				url += '&orderBy='+listQuery.orderBy+'&order='+listQuery.order;
				url += '&query='+encodeURI(listQuery.query);
			}
			
			return $http.get(url);
		}

		var deleteRealm = function(realms) {
			return $http.put('/goriguard/realms', realms );
		}

		var createRealm = function(realm) {
			return $http.post('/goriguard/realm', realm);
		}

		var updateRealm = function(realm) {
			return $http.put('/goriguard/realm', realm);
		}

		var getRealmUsers = function(realmId, listQuery) {
			var url = '/goriguard/realm/'+realmId+'/users';

			if ( angular.isDefined(listQuery) ) {
				url += '?pageSize='+listQuery.pageSize+'&offset='+listQuery.offset;
				url += '&orderBy='+listQuery.orderBy+'&order='+listQuery.order;
				url += '&name='+encodeURI(listQuery.query);
			}
			
			return $http.get(url);
		}

		var getRealmUsersByRole = function(realmId, role) {
			var url = '/goriguard/realm/'+realmId+'/users';
			url += '?role='+role;
			
			return $http.get(url);
		}

		var deleteUser = function(realmId, users) {
			return $http.put('/goriguard/realm/'+realmId+'/users', users);
		}

		var createUser = function(realmId, user) {
			return $http.post('/goriguard/realm/'+realmId+'/user', user);
		}

		var updateUser = function(realmId, user) {
			return $http.put('/goriguard/realm/'+realmId+'/user', user);
		}

		var getRealmRoles = function(realmId, listQuery) {
			var url = '/goriguard/realm/'+realmId+'/roles';

			if ( angular.isDefined(listQuery) ) {
				url += '?pageSize='+listQuery.pageSize+'&offset='+listQuery.offset;
				url += '&orderBy='+listQuery.orderBy+'&order='+listQuery.order;
				url += '&name='+encodeURI(listQuery.query);
			}
			
			return $http.get(url);
		}

		var deleteRole = function(realmId, roles) {
			return $http.put('/goriguard/realm/'+realmId+'/roles', roles);
		}

		var createRole = function(realmId, role) {
			return $http.post('/goriguard/realm/'+realmId+'/role', role);
		}

		var updateRole = function(realmId, role) {
			return $http.put('/goriguard/realm/'+realmId+'/role', role);
		}

		return {
			getRealm: getRealm,
			getRealms: getRealms,
			getRealmUsersByRole: getRealmUsersByRole,
			deleteRealm: deleteRealm,
			createRealm: createRealm,
			updateRealm: updateRealm,
			getRealmUsers: getRealmUsers,
			deleteUser: deleteUser,
			createUser: createUser,
			updateUser: updateUser,
			getRealmRoles: getRealmRoles,
			deleteRole: deleteRole,
			createRole: createRole,
			updateRole: updateRole
		}
	}]);
