var dateFormat = require('dateformat');

require('ui/modules')
	.get('app/goriguard', ['ngMaterial', 'md.data.table'])
	.directive('usersDataTable', function() {
    return {
      template: require('plugins/goriguard/home/realm/users/table.tmpl.html'),
      link: function($scope, $element, attrs) {
      }
    };
  })
  .controller('realmUsersController', ['$scope', 'goriguardApiService', '$routeParams', '$mdDialog', 'userDialogService', 'kibastrapToastService',
   function ($scope, goriguardApiService, $routeParams, $mdDialog, userDialogService, kibastrapToastService) {
    console.info('realm users controller loaded for ' + $routeParams.realmId);

		$scope.selected = [];
		$scope.deferred = null;
		$scope.itemsList = { data: [] }
		$scope.query = null;
		$scope.listQuery = {
	  	pageSize: 10,
	  	offset: 0,
	  	orderBy: 'created',
	  	order: 'asc',
	  	query: '',
	  	page: 1
	  }

    if ( angular.isDefined($routeParams.realmId) ) {
    	$scope.selectedRealmId = $routeParams.realmId;
    }

    var getRealms = function () {
      goriguardApiService.getRealms().then(function(response){
      	$scope.realms = response.data.hits;
      });
    }

	  $scope.updateTable = function() {
	  	return function (resp) {
	  		$scope.listQuery.total = resp.data.total;
        $scope.itemsList.data = resp.data.hits; 
	    }
	  };
	  $scope.deferred = goriguardApiService.getRealmUsers($routeParams.realmId, $scope.listQuery).then($scope.updateTable());

	  $scope.search = function (query) {
	  	$scope.listQuery.query = query;
	  	$scope.deferred = goriguardApiService.getRealmUsers($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	  };
	  
	  $scope.$watch('listQuery.query', function(query) {
	  	if ( angular.isDefined(query) ) {
	  		$scope.search(query);
	  	};
	  })

	  $scope.onOrderChange = function (order) {
	  	$scope.listQuery.order = "asc";
	  	$scope.listQuery.orderBy = order;
	  	if ( order.substring(0,1) == "-" ) {
	  		$scope.listQuery.order = "desc";
	  		$scope.listQuery.orderBy = order.substring(1, order.length);
	  	}
			$scope.deferred = goriguardApiService.getRealmUsers($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	  };

	  $scope.onPaginationChange = function (page, limit) {
	  	$scope.listQuery.offset = (( $scope.listQuery.page - 1 ) * $scope.listQuery.pageSize) + 1;
	  	$scope.search($scope.listQuery.query);
	  };

	  $scope.deleteUser = function(ev) {
	    userDialogService.deleteUser($scope.selected).then(function(response) {
	    	console.info("delete user success");
	    	setTimeout(function () {
	    		$scope.deferred = goriguardApiService.getRealmUsers($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	    		kibastrapToastService.showSuccessToast("User successfully deleted !");
			  }, 1000);
	    });
	  };

	  $scope.createUser = function(ev) {
	    $mdDialog.show({
	      controller: createUserController,
	      template: require('plugins/goriguard/home/realm/users/create/index.html'),
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals: {
	      	realmId: $routeParams.realmId
	      } 
	    }).then(function(){
	    	$scope.deferred = goriguardApiService.getRealmUsers($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	    });
    };

	  $scope.editUser = function(ev) {
	  	$mdDialog.show({
	      controller: editUserController,
	      template: require('plugins/goriguard/home/realm/users/edit/index.html'),
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals: {
	      	realmId: $routeParams.realmId,
	      	userId: $scope.selected[0]._id, 
	      	user: $scope.selected[0]._source,
	      } 
	    }).then(function(){
	    	$scope.deferred = goriguardApiService.getRealmUsers($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	    });
	  }

	  getRealms();

	 }
  ]);

function createUserController ($scope, goriguardApiService, 
	$location, kibastrapToastService, realmDialogService, 
	$routeParams, $mdDialog, realmId) {

	$scope.user = {
		name: null,
		password: null,
		roles: []
	};

	console.info("createUserController loaded.");

	var getRoles = function () {
		goriguardApiService.getRealmRoles($routeParams.realmId).then(function(response) {
	  	$scope.roles = response.data.hits;
	  	console.log($scope.roles);
	  });
  }

  $scope.addRole = function() {
    if ( angular.isDefined($scope.selected.role) ) {
      if ( $scope.user.roles.indexOf($scope.selected.role) < 0 ) {
        $scope.user.roles.push($scope.selected.role);
      }
    }
  }

  $scope.cancelUserCreation = function(ev) {
  	$mdDialog.cancel();
  }

  $scope.saveUser = function() {
  	var message = "";

  	// TODO: better user validation (ValidatorService or Directive promise)
  	if ( angular.isUndefined($scope.user.name) ) {
  		message += "<br/> User name is required";
  	}

		if ( angular.isUndefined($scope.user.password) ) {
  		message += "<br/> User password is required";
  	}

  	if ( angular.isUndefined($scope.user.roles)
  		&& $scope.user.roles.length > 0 ) {
  		message += "<br/> At least one role is required";
  	}

  	// TODO: better user validation alert
  	if ( message.length > 0 ) {
  		kibastrapToastService.showErrorToast(message);
  	} else {
  		console.info("creating user");

  		var user = {
  			name: $scope.user.name,
  			password: $scope.user.password,
  			roles: $scope.user.roles,
  			realmId: realmId
  		}

			goriguardApiService.createUser($routeParams.realmId, user).then(function (resp) {
  			console.info("user created: " + resp.data.link );
  			setTimeout(function () {
	    		kibastrapToastService.showSuccessToast("User created !");
	    		$scope.message = "";
	    		$mdDialog.hide();
			  }, 1000);
    	},function(err){
    		kibastrapToastService.showErrorToast("User creation Failed !");
    	});
  	}
  }
  getRoles();
}

function editUserController ($scope, goriguardApiService, 
	$location, kibastrapToastService, realmDialogService, 
	$routeParams, $mdDialog, realmId, userId, user) {

	$scope.user = angular.copy(user);

	console.info("createUserController loaded.");

	var getRoles = function () {
		goriguardApiService.getRealmRoles($routeParams.realmId).then(function(response) {
	  	$scope.roles = response.data.hits;
	  });
  }

  $scope.addRole = function() {
    if ( angular.isDefined($scope.selected.role) ) {
      if ( $scope.user.roles.indexOf($scope.selected.role) < 0 ) {
        $scope.user.roles.push($scope.selected.role);
      }
    }
  }

  $scope.cancelUserCreation = function(ev) {
  	$mdDialog.cancel();
  }

  $scope.saveUser = function() {
  	var message = "";

  	// TODO: better user validation (ValidatorService or Directive promise)
  	if ( angular.isUndefined($scope.user.name) ) {
  		message += "<br/> User name is required";
  	}

		if ( angular.isUndefined($scope.user.password) ) {
  		message += "<br/> User password is required";
  	}

  	if ( angular.isUndefined($scope.user.roles)
  		&& $scope.user.roles.length > 0 ) {
  		message += "<br/> At least one role is required";
  	}

  	// TODO: better user validation alert
  	if ( message.length > 0 ) {
  		kibastrapToastService.showErrorToast(message);
  	} else {
  		console.info("creating user");

  		var user = {
  			userId: userId,
  			name: $scope.user.name,
  			password: $scope.user.password,
  			roles: $scope.user.roles,
  			realmId: realmId
  		}

			goriguardApiService.updateUser($routeParams.realmId, user).then(function (resp) {
  			console.info("user updated: " + resp.data.link );
  			setTimeout(function () {
	    		kibastrapToastService.showSuccessToast("User updated !");
	    		$scope.message = "";
	    		$mdDialog.hide();
			  }, 1000);
    	},function(err){
    		kibastrapToastService.showErrorToast("User updated Failed !");
    	});   
  	}
  }

  getRoles();
}