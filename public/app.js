require('angular-animate');
require('angular-material');
require('angular-aria');
require('angular-ellipsis');

require('plugins/goriguard/lib/md-data-table.min.js'); 

require('plugins/goriguard/common/api/api.js');
require('plugins/goriguard/common/dialog/kibastrap-dialog.js');
require('plugins/goriguard/common/menu/kibastrap-menu.js');
require('plugins/goriguard/common/menu/menu.less');
require('plugins/goriguard/common/table/table.less');
require('plugins/goriguard/common/toast/kibastrap-toast.js');
require('plugins/goriguard/common/toast/toast.less');
require('plugins/goriguard/common/main.less');

require('plugins/goriguard/home/home.js');
require('plugins/goriguard/home/home.less');

require('plugins/goriguard/common/dialog/realm/dialog.js');
require('plugins/goriguard/common/dialog/users/dialog.js');
require('plugins/goriguard/common/dialog/roles/dialog.js');

require('plugins/goriguard/home/realm/create/create.less');

require('plugins/goriguard/home/realm/users/users.js');
require('plugins/goriguard/home/realm/users/users.less');
require('plugins/goriguard/home/realm/users/create/create.less');

require('plugins/goriguard/home/realm/roles/roles.js');
require('plugins/goriguard/home/realm/roles/roles.less');
require('plugins/goriguard/home/realm/roles/create/create.less');


require('ui/routes').enable();
require('ui/routes')
  .when('/', {
    template: require('plugins/goriguard/home/index.html'),
    controller: 'homeController'
 	})
  .when('/realm/users', {
    template: require('plugins/goriguard/home/realm/users/index.html'),
    controller: 'realmUsersController'
  })
  .when('/realm/roles', {
    template: require('plugins/goriguard/home/realm/roles/index.html'),
    controller: 'realmRolesController'
  });

require('ui/chrome')
.setBrand({
  logo: 'url(/plugins/goriguard/assets/banner.png) center no-repeat'
})
.setTabs([])
.setNavBackground('#222222');

require('ui/modules')
  .get('app/goriguard', ['ngMaterial'])
.config(function($mdThemingProvider) {
   // Extend the red theme with a few different colors
  var goriguard = $mdThemingProvider.extendPalette('brown', {
    'A200': '#a95f27'
  });
  // Register the new color palette map with the name <code>neonRed</code>
  $mdThemingProvider.definePalette('goriguard', goriguard);
  // Use that theme for the primary intentions
  $mdThemingProvider.theme('default')
    .accentPalette('goriguard')
});