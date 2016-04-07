var dateFormat = require('dateformat');

require('ui/modules')
	.get('app/goriguard', ['ngMaterial'])
  .directive('realmNavBar', ['goriguardApiService', '$mdDialog', '$mdMedia', '$location',
   function (goriguardApiService, $mdDialog, $mdMedia, $location) {
    return {
      replace: true,
      template: require('plugins/goriguard/common/navbar/realm.nav-bar.tmpl.html'),
      link: function($scope, $element, attrs) {
        var getRealms = function () {
          goriguardApiService.getRealms().then(function(response){
            $scope.realms = response.data.hits;
          });
        }

        $scope.createRealm = function(ev) {
          console.info('createRealm started');
          $mdDialog.show({
            controller: createRealmController,
            template: require('plugins/goriguard/home/realm/create/index.html'),
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          })
          .then(function(realmId) {
            $location.path('/realm/users').search({realmId: realmId});
          });
        };

        $scope.openRealm = function(realmId) {
          $location.path('/realm/users').search({realmId: realmId});
        }

        getRealms();
      }
    };
  }])
  .controller('homeController', ['$scope',
   function ($scope) {    
	 }
  ]);

function createRealmController ($scope, goriguardApiService, $location, kibastrapToastService, realmDialogService, $routeParams, $mdDialog) {

	console.info("createRealmController loaded.");

  $scope.cancelRealmCreation = function(ev) {
  	$mdDialog.cancel();
  }

  $scope.saveRealm = function() {
  	var message = "";

  	// TODO: better realm validation (ValidatorService or Directive promise)
  	if ( angular.isUndefined($scope.realm.name) ) {
  		message += "Realm name is required<br/> ";
  	}

		if ( angular.isUndefined($scope.realm.type) ) {
  		message += "Realm type is required<br/> ";
  	}

  	// TODO: better realm validation alert
  	if ( message.length > 0 ) {
  		kibastrapToastService.showErrorToast(message);
  	} else {
  		console.info("creating realm");

  		var realm = {
  			name: $scope.realm.name,
  			type: $scope.realm.type
  		}

			goriguardApiService.createRealm(realm).then(function (resp) {
  			console.info("realm created: " + resp.data.link );
  			setTimeout(function () {
	    		kibastrapToastService.showSuccessToast("Realm created !");
	    		$scope.message = "";
	    		$mdDialog.hide(resp.data.realmId);
			  }, 1000);
    	},function(err){
    		kibastrapToastService.showErrorToast("Realm creation Failed !");
    	});   
  	}
  }
}