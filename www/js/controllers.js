angular.module('app.controllers', [])

.controller('AppController', function($scope) {
})

.controller('MenuController', function($scope, $state, User) {
  User.then(function(data) {
    $scope.auth = data.auth;
    $scope.settings = data.settings;
  });

  $scope.signOut = function() {
    $scope.settings.$destroy();
    $scope.auth.$signOut();
  }
})

.controller('LoginController', function($scope, User) {
  User.then(function(data) {
    $scope.auth = data.auth;
  });
})

.controller('DashboardController', function($scope, $state, User) {
  User.then(function(data) {
    $scope.auth = data.auth;
    $scope.settings = data.settings;
  });
})

.controller('UploadController', function($scope, $timeout, User) {
  User.then(function(data) {
    $scope.fileList = data.fileList;
    $scope.storage = data.storage;
  });

  $scope.uploadProgress = 0;
  $scope.showComplete = false;

  $scope.uploadFile = function() {
    if ($scope.files !== undefined) {
      // Make the progress bar show up
      $scope.uploadProgress = 5;

      var file = $scope.files[0];
      var originalName = file.name;
      var name = new Date().getTime().toString() + '.' + file.name.split('.').pop();
      var uploadTask = $scope.storage.child(name).put(file);

      uploadTask.on('state_changed', function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        $scope.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $scope.$apply();
      }, function(error) {
        // Handle unsuccessful uploads
        $scope.uploadProgress = 0;
        console.error(error);
      }, function() {
        // Handle successful uploads
        var downloadURL = uploadTask.snapshot.downloadURL;
        // Remove token from the url
        downloadURL = downloadURL.substring(0, downloadURL.indexOf('&token'));

        var file = {
          date: new Date().toDateString(),
          name: name,
          original: originalName,
          url: downloadURL,
        }

        $scope.fileList.$add(file);

        $scope.showComplete = true;
        $scope.uploadProgress = 0;

        console.log("upload complete");

        $timeout(function() {
          $scope.showComplete = false;
        }, 2500);
      });
    } else {
      console.error("No file selected to upload!");
    }
  }
})

.controller('SettingsController', function($scope, $state, User) {
  User.then(function(data) {
    $scope.auth = data.auth;
    $scope.settings = data.settings;

    data.settings.$bindTo($scope, "settings").then(function(unbind) {
      $scope.$on('$ionicView.beforeLeave', function() {
        unbind();
      })
    });
  });
})


;
