require('ui/modules')
	.get('app/goriguard')
	.service('realmDialogService', ['kibastrapDialogService'
		, function (kibastrapDialogService) {
		var deleteRealmDialogTemplate = require('plugins/goriguard/common/dialog/realm/delete.tmpl.html');

		var deleteRealm = function(realm) {
			return kibastrapDialogService.showDialog(deleteRealmDialogTemplate, realm, 'realmDialogCtrl');
		}

		return {
			deleteRealm: deleteRealm
		}
		
	}])
	.controller('realmDialogCtrl', ['kibastrapDialogService', '$scope', 'goriguardApiService'
		, function(kibastrapDialogService, $scope, goriguardApiService) {

		$scope.selectedItems = kibastrapDialogService.getSelectedItems();

	  $scope.cancel = function() {
  		kibastrapDialogService.cancel();
  	}

  	$scope.deleteRealm = function() {
  		console.info("realm deleted");
  		console.log($scope.selectedItems);
  		kibastrapDialogService.hide(goriguardApiService.deleteRealm([$scope.selectedItems]));
  	}

	}]);
