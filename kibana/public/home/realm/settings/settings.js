var dateFormat = require('dateformat');

require('ui/modules')
	.get('app/goriguard', ['ngMaterial', 'md.data.table'])
  .controller('realmSettingsController', ['$scope', 'goriguardApiService', '$routeParams', '$mdDialog', 'realmDialogService', 'kibastrapToastService', '$location',
   function ($scope, goriguardApiService, $routeParams, $mdDialog, realmDialogService, kibastrapToastService, $location) {
    console.info('realm users controller loaded for ' + $routeParams.realmId);

	    $scope.routeParams = $routeParams;

	    var getRealms = function () {
	      goriguardApiService.getRealms().then(function(response){
	      	$scope.realms = response.data.hits;
	      });
	    }

	    var getRealm = function() {
	    	goriguardApiService.getRealm($scope.selectedRealmId).then(function(response) {
		    	$scope.realm = response.data.realm._source;
		    	$scope.realm._id = response.data.realm._id;
		    	console.log($scope.realm);
		    });
	    }

	    $scope.deleteRealm = function() {
	    	console.log("deleteRealm")
	    	realmDialogService.deleteRealm($scope.realm).then(function(response) {
		    	console.info("delete realm success");
		    	setTimeout(function () {
		    		$location.path('/');
		    		kibastrapToastService.showSuccessToast("Realm successfully deleted !");
				  }, 1000);
		    });
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
		  		console.info("update realm");

		  		var realm = {
		  			realmId: $scope.selectedRealmId,
		  			name: $scope.realm.name,
		  			type: $scope.realm.type,
		  			key: $scope.realm.key
		  		}

					goriguardApiService.updateRealm(realm).then(function (resp) {
		  			console.info("realm updated: " + resp.data.link );
		  			setTimeout(function () {
			    		kibastrapToastService.showSuccessToast("Realm updated !");
			    		$scope.message = "";
			    		$mdDialog.hide();
			    		getRealms();
			    		getRealm();
					  }, 1000);
		    	},function(err){
		    		kibastrapToastService.showErrorToast("Realm update Failed !");
		    	});   
		  	}
		  }

	    $scope.$watch('routeParams', function(routeParams, oldVal) {
				if ( angular.isDefined(routeParams.realmId) ) {
		    	$scope.selectedRealmId = routeParams.realmId;
		    	getRealms();
		    	getRealm();
		    }
	    }, true);
		}		
  ]);