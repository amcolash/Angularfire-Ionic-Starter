angular.module('app.factories', [])

.factory('Auth', ['$firebaseAuth', '$q', function($firebaseAuth, $q) {
  return $firebaseAuth();
}])


// The below factories have deferred promises because we need to wait for a uid first
.factory('Settings', ['Auth', '$firebaseObject', '$q', function(Auth, $firebaseObject, $q) {
  var deferred = $q.defer();

  Auth.$onAuthStateChanged(function(authData) {
    if (authData && authData.uid) {
      var ref = firebase.database().ref('users/' + authData.uid + '/settings');
      var settings = $firebaseObject(ref);

      // Need to wait while the object is loaded
      settings.$loaded().then(function() {
        deferred.resolve(settings);
      });
    }
  });

  return deferred.promise;
}])

.factory('Storage', ['Auth', '$firebaseArray', '$q', function(Auth, $firebaseArray, $q) {
  var deferred = $q.defer();

  Auth.$onAuthStateChanged(function(authData) {
    if (authData && authData.uid) {
      var fileRef = firebase.database().ref('users/' + authData.uid + '/files');
      var fileList = $firebaseArray(fileRef);

      var storageRef = firebase.storage().ref();
      var storage = storageRef.child('users/' + authData.uid + '/uploads');

      deferred.resolve({
        fileList: fileList,
        storage: storage
      });
    }
  });

  return deferred.promise;
}])
