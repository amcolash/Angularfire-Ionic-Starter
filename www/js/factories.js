angular.module('app.factories', [])

.factory('User', function($firebaseAuth, $firebaseArray, $firebaseObject, $q,  $state, CONFIG) {
    var deferred = $q.defer();

    firebase.initializeApp(CONFIG);

    var auth = $firebaseAuth();
    var fileList;
    var settings;
    var storage;

    // any time auth status updates, add the user data to scope
    auth.$onAuthStateChanged(function(authData) {
      auth.authData = authData;

      if (authData === null || authData === undefined) {
        deferred.resolve(
          {
            auth: auth,
            fileList: fileList,
            settings: settings,
            storage: storage
          }
        );

        $state.go('app.login');
      } else {
        var USER = authData.uid;
        var ref = firebase.database().ref('users/' + USER + '/settings');
        settings = $firebaseObject(ref);

        // Don't really need to wait for these references to load in most cases
        var fileRef = firebase.database().ref('users/' + USER + '/files');
        fileList = $firebaseArray(fileRef);

        var storageRef = firebase.storage().ref();
        storage = storageRef.child('users/' + USER + '/uploads');

        // Wait until we have settings - that way things are all set to go.
        settings.$loaded().then(function() {
          deferred.resolve(
            {
              auth: auth,
              fileList: fileList,
              settings: settings,
              storage
            }
          );

          if ($state.current.name === "app.login") {
            console.log("dashboard time!")
            $state.go('app.dashboard');
          }
        }).catch(function(error) {
          deferred.resolve(
            {
              auth: auth,
              fileList: fileList,
              settings: settings,
              storage: storage
            }
          );

          $state.go('app.login');
        });
      }
    });

    return deferred.promise;
  }
)
