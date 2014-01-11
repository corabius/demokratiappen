

angular.module('democracy-app', [])

.factory('ParseInitializer', function() {
  init_demokratiappen();
})

.factory('LoginService', function($rootScope, ParseInitializer) {
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

    obj.username = '';
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
          $rootScope.$apply();
        },
        error: function(user, error) {
          obj.setStateLoginProcess(obj.REGISTRATION_FAILED);
          $rootScope.$apply();
        }
      });
  };

  obj.logout = function() {
    Parse.User.logOut();
    obj.setStateLoggedIn(obj.NOT_LOGGED_IN);
  };

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
})

.factory('AddPageService', function($rootScope, ParseInitializer) {
  var obj = {}
  obj.url = '';
  obj.messageClass = '';

  return obj;
})

.controller('AddPageController', function($scope, AddPageService) {
  $scope.addPageService = AddPageService;
  $scope.post = function () {
    var Page = Parse.Object.extend("Page");
    var page = new Page();
 
    page.set("url", $scope.addPageService.url);
    var currentUser = Parse.User.current();
    page.set("title", "");
    page.set("user", currentUser); 
    page.set("positive_tags", []);
    page.set("negative_tags", []);
    page.setACL(new Parse.ACL(currentUser));
 
    page.save(null, {
      success: function(page) {
      },
      error: function(page, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and description.
        alert('Failed to create new object, with error code: ' + error.description);
      }
    });
  };

  var query = new Parse.Query("Tag");
  query.find().then(function(tags) {
    $scope.tags = _.map(tags, function(tag) {
      return tag.get("name");
    });

    $scope.$apply();
  });
})

.controller('ListController', function($scope) {
  var query = new Parse.Query("Page");
  query.find().then(function(articles) {
    $scope.articles = _.map(articles, function(article) {
      var tags = _.map(article.get("positive_tags"), function(tag) {
        return {name: tag, type:'success'};
      }).concat(_.map(article.get("negative_tags"), function(tag) {
        return {name: tag, type:'danger'};
      }));
      return {
        title: article.get("title"),
        url: article.get("url"),
        tags: _.sortBy(tags, function(el) {
          return el.name;
        })
      };
    });

    $scope.$apply();
  });

});

