NOT_LOGGED_IN = 0;
LOGGED_IN = 1;

angular.module('democracy-app', [])

.factory('ParseInitializer', function() {
  Parse.initialize("amtD1gwFz83IOqSdVF6I2oaxZeqRJRE57nyj3dKY", 
                   "24l3K1yDJpxkiYF4ZjUCtereM2jx9lET9LtKCvB4");
})

.factory('LoginService', function($rootScope, ParseInitializer) {
  var obj = {}
  obj.setLoginState = function(newState, message, messageClass) {
    obj.state = newState;
    obj.message = message;
    if (messageClass === undefined) {
      obj.messageClass = '';
    } else {
      obj.messageClass = messageClass;
    }
  };

  if (Parse.User.current()) {
    obj.state = LOGGED_IN;
  } else {
    obj.state = NOT_LOGGED_IN;
  }
  obj.message = '';
  obj.messageClass = '';

  return obj;
})

.controller('MainController', function($scope, LoginService) {
  $scope.loginService = LoginService;
})

.controller('LoginController', function($scope, LoginService) {
  if (Parse.User.current()) {
    $scope.mdLoginState = LOGGED_IN;
  } else {
    $scope.mdLoginState = NOT_LOGGED_IN;
  }
  $scope.login = function() {
    Parse.User.logIn($scope.username, $scope.password, {
      success: function(user) {
        LoginService.setLoginState(LOGGED_IN, "Inloggad.", "alert-success");
        $scope.$apply();
      },
      error: function(user, error) {
        LoginService.setLoginState(NOT_LOGGED_IN, "Inloggning misslyckades.", "alert-danger");
        $scope.$apply();
      }
    });
  };
  $scope.signUp = function() {
    Parse.User.signUp($scope.username, $scope.password, { ACL: new Parse.ACL() }, {
      success: function(user) {
        LoginService.setLoginState(LOGGED_IN, "Registrerad och inloggad.", "alert-success");
        $scope.$apply();
      },
      error: function(user, error) {
        LoginService.setLoginState(NOT_LOGGED_IN, "Registrering misslyckades.", "alert-danger");
        $scope.$apply();
      }
    })
  };
  $scope.logout = function() {
    Parse.User.logOut();
    LoginService.setLoginState(NOT_LOGGED_IN, "Du har nu blivit utloggad.", "alert-success");
  }
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