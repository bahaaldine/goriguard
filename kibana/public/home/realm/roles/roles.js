var dateFormat = require('dateformat');

require('ui/modules')
	.get('app/goriguard', ['ngMaterial', 'md.data.table'])
	.directive('rolesDataTable', function() {
    return {
      template: require('plugins/goriguard/home/realm/roles/table.tmpl.html'),
      link: function($scope, $element, attrs) {
      }
    };
  })
  .controller('realmRolesController', ['$scope', 'goriguardApiService', '$routeParams', '$mdDialog', 'roleDialogService', 'kibastrapToastService',
   function ($scope, goriguardApiService, $routeParams, $mdDialog, roleDialogService, kibastrapToastService) {
    console.info('realm roles controller loaded for ' + $routeParams.realmId);

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

	  $scope.routeParams = $routeParams;

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

	  $scope.search = function (query) {
	  	$scope.listQuery.query = query;
	  	$scope.deferred = goriguardApiService.getRealmRoles($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
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
			$scope.deferred = goriguardApiService.getRealmRoles($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	  };

	  $scope.onPaginationChange = function (page, limit) {
	  	$scope.listQuery.offset = (( $scope.listQuery.page - 1 ) * $scope.listQuery.pageSize) + 1;
	  	$scope.search($scope.listQuery.query);
	  };

	  $scope.deleteRole = function(ev) {
	  	goriguardApiService.getRealmUsersByRole($routeParams.realmId, $scope.selected[0]._source.name).then(function(response) {
	  		var users = [];
	  		if ( response.data.hits.length > 0 ) {
	  			users = response.data.hits.map(function(hit){
	  				return hit._source.name;
	  			});
	  			roleDialogService.displayUsersforRole($scope.selected, users);
	  		} else {
	  			roleDialogService.deleteRole($scope.selected).then(function(response) {
			    	console.info("delete role success");
			    	setTimeout(function () {
			    		$scope.deferred = goriguardApiService.getRealmRoles($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
			    		kibastrapToastService.showSuccessToast("Role successfully deleted !");
					  }, 1000);
			    });
	  		}
	  	});
	  };

	  $scope.createRole = function(ev) {
	    $mdDialog.show({
	      controller: createRoleController,
	      template: require('plugins/goriguard/home/realm/roles/create/index.html'),
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals: {
	      	realmId: $routeParams.realmId
	      }
	    }).then(function() {
	    	$scope.deferred = goriguardApiService.getRealmRoles($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	    });
    };

	  $scope.editRole = function(ev) {
	  	$mdDialog.show({
	      controller: editRoleController,
	      template: require('plugins/goriguard/home/realm/roles/edit/index.html'),
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      locals: {
	      	realmId: $routeParams.realmId,
	      	role: $scope.selected[0]._source,
	      	roleId: $scope.selected[0]._id
	      }
	    }).then(function() {
	    	$scope.deferred = goriguardApiService.getRealmRoles($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	    });
	  }

	  $scope.$watch('routeParams', function(routeParams, oldVal) {
			if ( angular.isDefined(routeParams.realmId) ) {
	    	$scope.selectedRealmId = routeParams.realmId;
	    	getRealms();
				$scope.deferred = goriguardApiService.getRealmRoles($routeParams.realmId, $scope.listQuery).then($scope.updateTable());
	    }
    }, true);
	 }
  ]);

function createRoleController ($scope, goriguardApiService, $location, kibastrapToastService, realmDialogService, $routeParams, $mdDialog, realmId) {

	console.info("createRoleController loaded.");

  $scope.cancelRoleCreation = function(ev) {
  	$mdDialog.cancel();
  }

  $scope.saveRole = function() {
  	var message = "";

  	// TODO: better role validation (ValidatorService or Directive promise)
  	if ( angular.isUndefined($scope.role.name) ) {
  		message += "Role name is required<br/>";
  	}

		if ( angular.isUndefined($scope.role.description) ) {
  		message += "Role description is required<br/>";
  	}

  	// TODO: better role validation alert
  	if ( message.length > 0 ) {
  		kibastrapToastService.showErrorToast(message);
  	} else {
  		console.info("creating role");

  		var role = {
  			name: $scope.role.name,
  			description: $scope.role.description,
  			realmId: realmId
  		}

			goriguardApiService.createRole($routeParams.realmId, role).then(function (resp) {
  			console.info("role created: " + resp.data.link );
  			setTimeout(function () {
	    		kibastrapToastService.showSuccessToast("Role created !");
	    		$scope.message = "";
	    		$mdDialog.hide();
			  }, 1000);
    	},function(err){
    		kibastrapToastService.showErrorToast("Role creation Failed !");
    	});   
  	}
  }
}

function editRoleController ($scope, goriguardApiService, $location, kibastrapToastService, realmDialogService, $routeParams, $mdDialog, realmId, roleId, role) {

	console.info("createRoleController loaded.");

	$scope.role = angular.copy(role);

  $scope.cancelRoleCreation = function(ev) {
  	$mdDialog.cancel();
  }

  $scope.saveRole = function() {
  	var message = "";

  	// TODO: better role validation (ValidatorService or Directive promise)
  	if ( angular.isUndefined($scope.role.name) ) {
  		message += "Role name is required<br/> ";
  	}

		if ( angular.isUndefined($scope.role.description) ) {
  		message += "Role description is required<br/> ";
  	}

  	// TODO: better role validation alert
  	if ( message.length > 0 ) {
  		kibastrapToastService.showErrorToast(message);
  	} else {
  		console.info("creating role");

  		var role = {
  			roleId: roleId,
  			name: $scope.role.name,
  			description: $scope.role.description,
  			realmId: realmId
  		}

			goriguardApiService.updateRole($routeParams.realmId, role).then(function (resp) {
  			console.info("role created: " + resp.data.link );
  			setTimeout(function () {
	    		kibastrapToastService.showSuccessToast("Role created !");
	    		$scope.message = "";
	    		$mdDialog.hide();
			  }, 1000);
    	},function(err){
    		kibastrapToastService.showErrorToast("Role creation Failed !");
    	});   
  	}
  }
}