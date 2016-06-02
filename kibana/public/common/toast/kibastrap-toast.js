require('ui/modules')
	.get('app/goriguard')
	.service('kibastrapToastService', ['$mdToast', '$sce', function ($mdToast, $sce) {
		var toastErrorTemplate = require('plugins/goriguard/common/toast/toast.tmpl.html');

		var toastMessage = "";
		var toastStatus = "";

		var getToastMessage = function() {
			return toastMessage;
		}

		var getToastStatus = function() {
			return toastStatus;
		}

		var showSuccessToast = function(message) {
			showToast(message, "success");
		}

		var showErrorToast = function(message) {
			showToast(message, "error");
		}

		var showToast = function(message, status) {
			toastMessage = $sce.trustAsHtml(message);
			toastStatus = status;
			$mdToast.show({
				controller: 'kibastrapToastCtrl',
				template: toastErrorTemplate,
				parent : angular.element(document.body),
				hideDelay: 6000,
				position: 'top right'
			});
		};

		return {
			showSuccessToast: showSuccessToast,
			showErrorToast: showErrorToast,
			getToastMessage: getToastMessage,
			getToastStatus: getToastStatus,
		}
		
	}])	
	.controller('kibastrapToastCtrl', ['kibastrapToastService', '$scope', '$mdToast'
		, function(kibastrapToastService, $scope, $mdToast) {
	  $scope.message = kibastrapToastService.getToastMessage();
	  $scope.getToastStatus = kibastrapToastService.getToastStatus();

	  $scope.closeToast = function() {
	    $mdToast.hide();
	  };
	}]);