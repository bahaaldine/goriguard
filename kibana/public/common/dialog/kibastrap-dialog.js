require('ui/modules')
	.get('app/goriguard')
	.service('kibastrapDialogService', ['$mdDialog', function ($mdDialog) {
		var selectedItems = [];
		var extraParams = null;

		var showDialog = function(template, items, controller, params) {
			if ( angular.isDefined(items) && items != null ) {
				selectedItems = items;
			}

			if ( angular.isDefined(params) && params != null ) {
				extraParams = params;
			}			

			return $mdDialog.show({
	      controller: controller,
	      template: template,
	      parent: angular.element(document.body),
	      clickOutsideToClose:true
	    });
		}

		var getSelectedItems = function() {
			return selectedItems;
		}

		var getExtraParams = function() {
			return extraParams;
		}

		var cancel = function() {
  		$mdDialog.cancel();
  	}

  	var hide = function(callback) {
  		$mdDialog.hide(callback);
  	}

		return {
			showDialog: showDialog,
			getSelectedItems: getSelectedItems,
			getExtraParams: getExtraParams,
			cancel: cancel,
			hide: hide
		}
		
	}]);