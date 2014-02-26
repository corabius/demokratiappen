var democracyServices = angular.module('democracy.service', [] );

democracyServices.factory('ParseInitializer', [ function() {
  init_demokratiappen();
}]);

democracyServices.factory('LoginService', [ '$rootScope', 'ParseInitializer', function($rootScope, ParseInitializer) {
  var obj = {
    LOGGED_IN: 0,
    NOT_LOGGED_IN: 1,
    INITIAL: 0,
    LOADING: 1,
    LOGIN_FAILED: 2,
    REGISTRATION_FAILED: 3
  };

  obj.stateLoggedIn = (Parse.User.current() ? obj.LOGGED_IN : obj.NOT_LOGGED_IN);
  obj.stateLoginProcess = obj.INITIAL;
  
  obj.setStateLoggedIn = function(newState) {
    obj.stateLoggedIn = newState;

    obj.password = '';
    obj.setStateLoginProcess(obj.INITIAL);
  };

  obj.setStateLoginProcess = function(newState) {
    obj.stateLoginProcess = newState;
  };

  obj.login = function() {
    obj.setStateLoginProcess(obj.LOADING);

    Parse.User.logIn(
      obj.username,
      obj.password,
      {
        success: function(user) {
          obj.setStateLoggedIn(obj.LOGGED_IN);
          $rootScope.$apply();
        },
        error: function(user, error) {
          obj.setStateLoginProcess(obj.LOGIN_FAILED);
          $rootScope.$apply();
        }
      });
  };

  obj.signUp = function(scope) {
    obj.setStateLoginProcess(obj.LOADING);

    Parse.User.signUp(
      obj.username,
      obj.password,
      { ACL: new Parse.ACL() },
      {
        success: function(user) {
          obj.setStateLoggedIn(obj.LOGGED_IN);
          obj.username = user.getUsername();
          $rootScope.$apply();
        },
        error: function(user, error) {
          obj.setStateLoginProcess(obj.REGISTRATION_FAILED);
          $rootScope.$apply();
        }
      });
  };

  obj.logout = function() {
    obj.username = '';
    Parse.User.logOut();
    obj.setStateLoggedIn(obj.NOT_LOGGED_IN);
  };

  obj.username = (Parse.User.current() ? Parse.User.current().getUsername() : '');

  return obj;
}]);

