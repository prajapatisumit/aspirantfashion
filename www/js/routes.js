angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tabsController', {
    url: '/tabsController',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/login',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('tabsController.signup', {
    url: '/signup',
    views: {
      'tab3': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('menu2', {
      url: '/menu2',
      templateUrl: 'templates/menu2.html',
      controller: 'menuTwoCtrl'
    })

  .state('sideMenu', {
      // url: '/sideMenu',
      templateUrl: 'templates/sideMenu.html',
      controller: 'indexCtrl'
    })

  .state('offers', {
    url: '/offers',
    templateUrl: 'templates/offers.html',
    controller: 'offersCtrl'
  })

  .state('myCart', {
    url: '/myCart',
    templateUrl: 'templates/myCart.html',
    controller: 'myCartCtrl'
  })

  .state('lastOrders', {
    url: '/lastOrders',
    templateUrl: 'templates/lastOrders.html',
    controller: 'lastOrdersCtrl'
  })

  .state('favourite', {
    url: '/favourite',
    templateUrl: 'templates/favourite.html',
    controller: 'favouriteCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('support', {
    url: '/support',
    templateUrl: 'templates/support.html',
    controller: 'supportCtrl'
  })

  .state('checkout', {
    url: '/checkout',
    templateUrl: 'templates/checkout.html',
    controller: 'checkoutCtrl'
  })

  .state('tabsController.forgotPassword', {
    url: '/forgotPassword',
    views: {
      'tab1': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }
    }
  })

  .state('admin', {
        url: '/admin?:product_id',
          templateUrl: 'templates/admin.html',
          controller: 'adminCtrl'
        })

  .state('details', {
          url: '/details?:category_id',
          templateUrl: 'templates/details.html',
          controller: 'detailsCtrl'
        })

$urlRouterProvider.otherwise('/tabsController/login')



});
