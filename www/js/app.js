// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('app', [
  'ionic',
  'firebase',
  'app.controllers',
  'app.directives',
  'app.factories'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // TODO: Change these to match your own application configuration
  var config = {
    apiKey: "AIzaSyAcgOtX8dqawOK7Vuu4ax3fiFg46KhoOKY",
    authDomain: "angularfire-ionic-starter.firebaseapp.com",
    databaseURL: "https://angularfire-ionic-starter.firebaseio.com",
    storageBucket: "angularfire-ionic-starter.appspot.com",
    messagingSenderId: "210927824483"
  };
  firebase.initializeApp(config);
})

.run(['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
  // Firebase and authentication init

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    if (error === 'AUTH_REQUIRED') {
      console.error('not authenticated');
      $state.go('login');
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, error) {
    // Prevent going back to the login page after a successful authentication
    if (toState.name === 'login' && Auth.$getAuth()) {
      event.preventDefault();
    }

    if (toState.name !== 'error' && !navigator.onLine) {
      event.preventDefault();
      $state.go('error');
    }
  })

  // When logging in / logging out, change states automatically
  Auth.$onAuthStateChanged(function(authData) {
    if (authData) {
      console.log(authData)
      // Go to dashboard after logging in
      if ($state.current.name === "login") {
        $state.go('app.dashboard');
      }
    } else {
      // Go back to login when logging out
      $state.go('login');
    }
  });
}])

// If this is a desktop app, might want to disable drag scrolling
// .config(function($ionicConfigProvider) {
//   $ionicConfigProvider.scrolling.jsScrolling(false);
// })

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })

    .state('error', {
      url: '/error',
      templateUrl: 'templates/error.html',
      controller: 'ErrorController'
    })

    .state('app', {
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'MenuController',
      // main app controller will not be loaded until $requireSignIn resolves
      // Auth refers to our $firebaseAuth wrapper in the factory below
      // $requireSignIn returns a promise so the resolve waits for it to complete
      // If the promise is rejected, it will throw a $stateChangeError (see above)
      resolve: {
        'currentAuth': ['Auth', function(Auth) {
          return Auth.$requireSignIn();
        }]
      }
    })

    .state('app.dashboard', {
      url: '/',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardController'
        }
      }
    })

    .state('app.upload', {
      url: '/upload',
      views: {
        'menuContent': {
          templateUrl: 'templates/upload.html',
          controller: 'UploadController'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsController'
        }
      }
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})

;
