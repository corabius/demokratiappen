/* Copyright (C) 2014 Demokratiappen.
 *
 * This file is part of Demokratiappen.
 *
 * Demokratiappen is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Demokratiappen is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Demokratiappen.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  var setStateLoginProcess = function(newState) {
    obj.stateLoginProcess = newState;
  };
 
  var setStateLoggedIn = function(newState) {
    obj.stateLoggedIn = newState;

    obj.password = '';
    setStateLoginProcess(obj.INITIAL);
  };

  obj.login = function() {
    setStateLoginProcess(obj.LOADING);

    var loginPromise = new Parse.Promise();
    Parse.User.logIn(
      obj.username,
      obj.password,
      {
        success: function(user) {
          setStateLoggedIn(obj.LOGGED_IN);
          $rootScope.$apply();
          loginPromise.resolve(user);
        },
        error: function(user, error) {
          setStateLoginProcess(obj.LOGIN_FAILED);
          $rootScope.$apply();
          loginPromise.reject(error);
        }
      });

     return loginPromise;
  };

  obj.loginOrSignupFacebook = function() {
    var loginPromise = new Parse.Promise();

    Parse.FacebookUtils.logIn("email", {
      success: function(user) {
        if (!user.existed()) {
          // User did not exist before, update the ACL on the newly created
          // user object.
          user.setACL({ ACL: new Parse.ACL() });
          user.save().then(function () {
            setStateLoggedIn(obj.LOGGED_IN);
            $rootScope.$apply();

            loginPromise.resolve(user);
          }, function (error) {
            setStateLoginProcess(obj.LOGIN_FAILED);
            $rootScope.$apply();

            loginPromise.reject(error);
          });
        }
        else {
          setStateLoggedIn(obj.LOGGED_IN);
          $rootScope.$apply();

          loginPromise.resolve(user);
        }
      },
      error: function(user, error) {
        setStateLoginProcess(obj.LOGIN_FAILED);
        $rootScope.$apply();
        loginPromise.reject(error);
      }
    });
    return loginPromise;
  };

  obj.signup = function() {
    setStateLoginProcess(obj.LOADING);

    var signupPromise = new Parse.Promise();
    var newUser = new Parse.User();
    newUser.set("username", obj.username);
    newUser.set("password", obj.password);
    newUser.set("email", obj.email);

    newUser.signUp(
      { ACL: new Parse.ACL() },
      {
        success: function(user) {
          obj.username = user.getUsername();
          setStateLoggedIn(obj.LOGGED_IN); 
          $rootScope.$apply();
          signupPromise.resolve(user);
        },
        error: function(user, error) {
          setStateLoginProcess(obj.REGISTRATION_FAILED);
          $rootScope.$apply();
          signupPromise.reject(error);
        }
      });
    return signupPromise;
  };

  obj.logout = function() {
    obj.username = '';

    Parse.User.logOut();
    setStateLoggedIn(obj.NOT_LOGGED_IN);
  };

  obj.username = (Parse.User.current() ? Parse.User.current().getUsername() : '');
  obj.email = '';

  return obj;
}]);

