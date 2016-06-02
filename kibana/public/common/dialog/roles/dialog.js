require('ui/modules')
	.get('app/goriguard')
	.service('roleDialogService', ['kibastrapDialogService'
		, function (kibastrapDialogService) {
		var deleteRoleDialogTemplate = require('plugins/goriguard/common/dialog/roles/delete.tmpl.html');
		var usersForRoleDialogTemplate = require('plugins/goriguard/common/dialog/roles/users-for-role.tmpl.html');

		var deleteRole = function(role) {
			return kibastrapDialogService.showDialog(deleteRoleDialogTemplate, role, 'roleDialogCtrl');
		}

		var displayUsersforRole = function(role, users) {
			return kibastrapDialogService.showDialog(usersForRoleDialogTemplate, role, 'roleDialogCtrl', users);
		}

		return {
			deleteRole: deleteRole,
			displayUsersforRole: displayUsersforRole
		}
		
	}])
	.controller('roleDialogCtrl', ['kibastrapDialogService', '$scope', 'goriguardApiService'
		, function(kibastrapDialogService, $scope, goriguardApiService) {

		$scope.selectedItems = kibastrapDialogService.getSelectedItems();
		$scope.users = kibastrapDialogService.getExtraParams();

		$scope.hide = function() {
  		kibastrapDialogService.hide();
  	}

	  $scope.cancel = function() {
  		kibastrapDialogService.cancel();
  	}

  	$scope.deleteRole = function() {
  		console.info("role deleted");
  		kibastrapDialogService.hide(goriguardApiService.deleteRole($scope.selectedItems[0]._source.realm_id, $scope.selectedItems));
  	}

	}]);
