var dateFormat = require('dateformat');

require('ui/modules')
	.get('app/goriguard', ['ngMaterial'])
  .controller('homeController', ['$scope', 'goriguardApiService', '$mdDialog', '$mdMedia', '$location',
   function ($scope, goriguardApiService, $mdDialog, $mdMedia, $location) {
    console.info('home controller loaded');
    
    var getRealms = function () {
      goriguardApiService.getRealms().then(function(response){
      	$scope.realms = response.data.hits;
      });
    }

    $scope.openRealm = function(realmId) {
      $location.path('/realm/users').search({realmId: realmId});
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
	    .then(function(answer) {
	      getRealms();
	    });
    };

    getRealms();
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
  		message += "<br/> Realm name is required";
  	}

		if ( angular.isUndefined($scope.realm.type) ) {
  		message += "<br/> Realm type is required";
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
	    		$mdDialog.hide();
			  }, 1000);
    	},function(err){
    		kibastrapToastService.showErrorToast("Realm creation Failed !");
    	});   
  	}
  }
}