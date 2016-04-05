var menu = require('plugins/goriguard/common/menu/menu.json');

require('ui/modules')
	.get('app/goriguard', ['ngMaterial'])
	.directive('kibastrapSideBar', function() {
    return {
      template: require('plugins/goriguard/common/menu/side-bar.tmpl.html'),
      link: function($scope, $element, attrs) {
      }
    };
  })
  .directive('kibastrapMenuToggle', [ 'kibastrapMenu', function(kibastrapMenu) {
    return {
      scope: {
        section: '='
      },
      controller: 'kibastrapMenuController',
      template: require('plugins/goriguard/common/menu/menu-toggle.tmpl.html')
    };
  }])
  .directive('kibastrapMenuLink',['kibastrapMenu', function (kibastrapMenu) {
    return {
      scope: {
        section: '='
      },
      controller: 'kibastrapMenuController',
      template: require('plugins/goriguard/common/menu/menu-link.tmpl.html')
    };
  }])
  //take all whitespace out of string
	.filter('nospace', function () {
	  return function (value) {
	    return (!value) ? '' : value.replace(/ /g, '');
	  };
	})
	//replace uppercase to regular case
	.filter('humanizeDoc', function () {
	  return function (doc) {
	    if (!doc) return;
	    if (doc.type === 'directive') {
	      return doc.name.replace(/([A-Z])/g, function ($1) {
	        return '-' + $1.toLowerCase();
	      });
	    }

	    return doc.label || doc.name;
	  };
	})
  .factory('kibastrapMenu', ['$location', function ($location) {

	  var sections = menu.items;

	  var self;

	  return self = {
	    sections: sections,

	    toggleSelectSection: function (section) {
	      self.openedSection = (self.openedSection === section ? null : section);
	    },
	    isSectionSelected: function (section) {
	      return self.openedSection === section;
	    },

	    selectPage: function (section, page) {
	      page && page.url && $location.path(page.url);
	      self.currentSection = section;
	      self.currentPage = page;
	    },

	    goToSection: function(section) {
	      $location.path(section.state);
	    }
	  };
	}])
	.controller('kibastrapMenuController', ['$scope', 'kibastrapMenu'
		, function ($scope, kibastrapMenu) {

			function goToSection(section) {
        // set flag to be used later when
        // $locationChangeSuccess calls openPage()
        // $scope.kibastrapMenu.autoFocusContent = true;
        kibastrapMenu.goToSection(section);
      };

	    function isOpen() {
	      return kibastrapMenu.isSectionSelected($scope.section);
	    }

	    function toggleOpen() {
	      kibastrapMenu.toggleSelectSection($scope.section);
	    }

	    function isSectionSelected() {
	      var section = $scope.section;
	      var selected = false;
	      var openedSection = kibastrapMenu.openedSection;
	      if(openedSection === section){
	        selected = true;
	      }
	      return selected;
	    }

			//functions for menu-link and menu-toggle
	    $scope.kbstrapCtrl = {
	    	isOpen: isOpen,
	    	toggleOpen: toggleOpen,
	    	isSectionSelected: isSectionSelected,
	    	autoFocusContent: false,
	    	menu: kibastrapMenu,
	    	goToSection: goToSection,
	    	status: {
	      	isFirstOpen: true,
	      	isFirstDisabled: false
	    	}
	    }
	}])