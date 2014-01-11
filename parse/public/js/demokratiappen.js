NOT_LOGGED_IN = 0;
LOGGED_IN = 1;

angular.module('democracy-app', [])

.factory('ParseInitializer', function() {
  Parse.initialize("amtD1gwFz83IOqSdVF6I2oaxZeqRJRE57nyj3dKY", 
                   "24l3K1yDJpxkiYF4ZjUCtereM2jx9lET9LtKCvB4");
})

.factory('LoginService', function($rootScope, ParseInitializer) {
  var obj = {}
  obj.setLoginState = function(newState) {
    obj.state = newState;

    if (newState == LOGGED_IN) {
      obj.username = '';
      obj.password = '';
    }
  };

  if (Parse.User.current()) {
    obj.state = LOGGED_IN;
  } else {
    obj.state = NOT_LOGGED_IN;
  }

  return obj;
})

.controller('MainController', function($scope, LoginService) {
  $scope.loginService = LoginService;
})

.controller('LoginController', function($scope, LoginService) {
  $scope.oldFillerHeight = 0;

  window.onresize = function() {
    // So that fillerHeight() is evaluated.
    $scope.$apply();
  }

  $scope.fillerHeight = function() {
    var newFillerHeight = Math.max(0, ($(window).height() - $('#modallogin').outerHeight(true)) / 2);
    if (Math.abs(newFillerHeight - $scope.oldFillerHeight) > 1) {
      $scope.oldFillerHeight = newFillerHeight;
    }
    
    return {height: $scope.oldFillerHeight + 'px'};
  };

  $scope.loginService = LoginService;
  $scope.login = function() {
    Parse.User.logIn(
      $scope.loginService.username,
      $scope.loginService.password,
      {
        success: function(user) {
          LoginService.setLoginState(LOGGED_IN);
          $scope.$apply();
        },
        error: function(user, error) {
          LoginService.setLoginState(NOT_LOGGED_IN);
          $scope.$apply();
        }
      });
  };
  $scope.signUp = function() {
    Parse.User.signUp(
      $scope.loginService.username,
      $scope.loginService.password,
      { ACL: new Parse.ACL() },
      {
        success: function(user) {
          LoginService.setLoginState(LOGGED_IN);
          $scope.$apply();
        },
        error: function(user, error) {
          LoginService.setLoginState(NOT_LOGGED_IN);
          $scope.$apply();
        }
      });
  };
  $scope.logout = function() {
    Parse.User.logOut();
    LoginService.setLoginState(NOT_LOGGED_IN);
  };
})

.controller('AddController', function($scope) {
  //var Tag = Parse.Object.extend("Tag");
  var query = new Parse.Query("Tag");
  query.find().then(function(tags) {
    $scope.tags = _.map(tags, function(tag) {
      return tag.get("name");
    });
    $scope.$apply();
  });
});
