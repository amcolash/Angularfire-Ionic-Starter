angular.module('app.controllers', [])

.controller('MenuController', ['$scope', 'Auth', 'Settings', 'Storage', function($scope, Auth, Settings, Storage) {
  Settings.then(function(data) {
    $scope.settings = data;
  });

  Storage.then(function(data) {
    $scope.fileList = data.fileList;
    $scope.storage = data.storage;
  });

  $scope.signOut = function() {
    // Remember to clean up references to FireBase objects/arrays here, otherwise you will get a ton of errors on a logout.
    if ($scope.settings) {
      $scope.settings.$destroy();
    }

    if ($scope.fileList) {
      $scope.fileList.$destroy();
    }

    Auth.$signOut();
  }
}])

.controller('ErrorController', ['$interval', '$scope', '$state', function($interval, $scope, $state) {
  $scope.check = $interval(function() {
    if (navigator.onLine) {
      $interval.cancel($scope.check);
      $state.go('app.dashboard');
    }
  }, 3000);
}])

.controller('LoginController', ['$scope', 'Auth', function($scope, Auth) {
  $scope.auth = Auth;
}])

.controller('DashboardController', function() {
})

.controller('UploadController', ['$scope', '$timeout', 'Storage', function($scope, $timeout, Storage) {
  Storage.then(function(data) {
    $scope.fileList = data.fileList;
    $scope.storage = data.storage;
  });

  $scope.uploadProgress = 0;
  $scope.showSuccess = false;
  $scope.showError = false;

  $scope.uploadFile = function() {
    if ($scope.files !== undefined) {
      // Make the progress bar show up at the beginning of the upload
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
      console.log("successfully removed file");
      $scope.fileList.$remove(file);
    }).catch(function(error) {
      console.error(error);
    });
  }
}])

.controller('SettingsController', ['$scope', '$state', 'Settings', function($scope, $state, Settings) {
  Settings.then(function(data) {
    data.$bindTo($scope, "settings").then(function(unbind) {
      $scope.$on('$ionicView.beforeLeave', function() {
        unbind();
      })
    });
  });
}])
