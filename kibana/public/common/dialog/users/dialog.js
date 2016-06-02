require('ui/modules')
	.get('app/goriguard')
	.service('userDialogService', ['kibastrapDialogService'
		, function (kibastrapDialogService) {
		var deleteUserDialogTemplate = require('plugins/goriguard/common/dialog/users/delete.tmpl.html');

		var deleteUser = function(user) {
			return kibastrapDialogService.showDialog(deleteUserDialogTemplate, user, 'userDialogCtrl');
		}

		return {
			deleteUser: deleteUser
		}
		
	}])
	.controller('userDialogCtrl', ['kibastrapDialogService', '$scope', 'goriguardApiService'
		, function(kibastrapDialogService, $scope, goriguardApiService) {

		$scope.selectedItems = kibastrapDialogService.getSelectedItems();

	  $scope.cancel = function() {
  		kibastrapDialogService.cancel();
  	}

  	$scope.deleteUser = function() {
  		console.info("user deleted");
  		kibastrapDialogService.hide(goriguardApiService.deleteUser($scope.selectedItems[0]._source.realm_id, $scope.selectedItems));
  	}

	}]);
