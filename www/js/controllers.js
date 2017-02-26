angular.module('app.controllers', [])

.controller('AppController', function($scope) {
})

.controller('MenuController', function($scope, $state, User) {
  User.then(function(data) {
    $scope.auth = data.auth;
    $scope.settings = data.settings;
    $scope.fileList = data.fileList;
  });

  $scope.signOut = function() {
    $scope.settings.$destroy();
    $scope.fileList.$destroy();
    $scope.auth.$signOut();
  }
})

.controller('LoginController', function($scope, $state, User) {
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
  $scope.showSuccess = false;
  $scope.showError = false;

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
        $scope.showError = true;
        console.error(error);
      }, function() {
        // Handle successful uploads
        var dateObj = new Date();

        var file = {
          date: dateObj.toDateString(),
          time: dateObj.toTimeString(),
          name: name,
          original: originalName,
          url: uploadTask.snapshot.downloadURL,
        }

        console.log("upload complete");

        $scope.fileList.$add(file);
        $scope.showSuccess = true;
      })

      uploadTask.then(function() {
        $scope.uploadProgress = 0;

        $timeout(function() {
          $scope.showSuccess = false;
          $scope.showError = false;
        }, 3500);
      })


    } else {
      console.error("No file selected to upload!");
    }
  }

  $scope.removeFile = function(file) {
    var name = file.name;
    var uploadTask = $scope.storage.child(name).delete().then(function() {
      console.log("successfully removed file")
      $scope.fileList.$remove(file);
    }).catch(function(error) {
      // Something went wrong
    });
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
