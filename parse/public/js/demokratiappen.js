

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

.factory('AddPageService', function($rootScope) {
  var obj = {}
  obj.url = '';
  obj.title = '';

  return obj;
})

.controller('AddPageController', function($scope, $rootScope, AddPageService, $location) {
  $scope.addPageService = AddPageService;
  $rootScope.pageAddCount = 0;

  $scope.$watch(function() {
    return $location.search();
  }, function() {
    if ($location.search().title) {
      $scope.addPageService.title = $location.search().title;
    }
    if ($location.search().url) {
      $scope.addPageService.url = $location.search().url;
    }
  });

  var indexOf = function(array, x) {
    var result = -1;
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === x.id) {
        result = i;
        break;
      }
    }
    return result;
  }

  updateUserTags = function(positiveTags, negativeTags) {
    // Add tags to the user object, first update the tags we already have
    var UserTag = Parse.Object.extend("UserTag");
    var currentUser = Parse.User.current();
    var allTags = positiveTags.concat(negativeTags);

    var query = new Parse.Query("UserTag");
    query.containedIn("tag", allTags);
    query.equalTo("user", currentUser);
    query.limit(allTags.length + 1);
    
    query.find({
      success: function(userTags) {
        for (var t = 0; t < userTags.length; t++) {
          var userTag = userTags[t];
          var tag = userTag.get("tag");

          // Check if this tag is positive
          var isPositive = (indexOf(positiveTags, tag) >= 0);
          var isNegative = (indexOf(negativeTags, tag) >= 0);

          // Update the user tag
          if (isPositive) {
            userTag.set("positiveCount", userTag.get("positiveCount") + 1);
          }
          if (isNegative) {
            userTag.set("negativeCount", userTag.get("negativeCount") + 1);
          }
          userTag.save();
        }

        // Create new user tags for the ones not contained in returned set.
        for (var i = 0; i < allTags.length; i++) {
          var tag = allTags[i];

          var needNewObject = true;
          for (var j = 0; needNewObject && (j < userTags.length); j++) {
            var userTag = userTags[j];
            var userTagTag = userTag.get("tag");
            needNewObject = !(userTagTag.id === tag.id);
          }

          if (needNewObject) {
            // Check if this tag is positive 
            var isPositive = (indexOf(positiveTags, tag) >= 0);
            var isNegative = (indexOf(negativeTags, tag) >= 0);

            // Create new UserTag object and initialize
            var userTag = new UserTag();
            userTag.set("tag", tag);
            userTag.set("name", tag.get("name"));
            userTag.set("positiveCount", isPositive ? 1 : 0);
            userTag.set("negativeCount", isPositive ? 0 : 1);
            userTag.set("user", currentUser);
            userTag.setACL(new Parse.ACL(currentUser));
            userTag.save();
          }
        }

        $rootScope.pageAddCount++;
        $scope.$apply();
      }
    });
  }


  $scope.post = function () {
    if (($scope.addPageService.title.length > 0)
        && ($scope.addPageService.url.length > 0)) {
      // Create new page object to fill in
      var Page = Parse.Object.extend("Page");
      var page = new Page();
      var currentUser = Parse.User.current();

      page.set("title", $scope.addPageService.title);
      page.set("url", $scope.addPageService.url);
      page.set("user", currentUser);
      page.setACL(new Parse.ACL(currentUser));

      // Create upTags or downTags array from the tags the user pressed
      var tagCount = $scope.tags.length;
      var upTags = [];
      var downTags = [];
      for (var index = 0; index < tagCount; index++) {
        var tag = $scope.tags[index];
        if (tag.up) {
          upTags = upTags.concat(tag);
        }
        else if (tag.down) {
          downTags = downTags.concat(tag);
        }
        delete tag.up;
        delete tag.down;
      }
      page.set("positive_tags", upTags);
      page.set("negative_tags", downTags);

      updateUserTags(upTags, downTags);

      page.save(null, {
        success: function(page) {
          // Clear the entry from
          $scope.addPageService.title = "";
          $scope.addPageService.url = "";
          $scope.addPageForm.$setPristine();
          $rootScope.pageAddCount++;
          $scope.$apply();
        },
        error: function(page, error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and description.
          alert('Failed to create new object, with error code: ' + error.description);
        }
      });
    }
  };

  $scope.resetTag = function(tag) {
    tag.up = false;
    tag.down = false;
  };

  var query = new Parse.Query("Tag");
  query.find().then(function(tags) {
    $scope.tags = tags;
    $scope.$apply();
  });
})

.controller('ListController', function($scope, $rootScope, LoginService) {
  function queryPage() {
    if (LoginService.stateLoggedIn != LoginService.LOGGED_IN) {
      return;
    }

    var currentUser = Parse.User.current();

    var query = new Parse.Query("Page");
    query.equalTo("user", currentUser);
    query.include(["positive_tags"]);
    query.include(["negative_tags"]);
    query.limit(20);

    query.find().then(function(articles) {
      $scope.articles = _.map(articles, function(article) {
        var a = {
          title: article.get("title"),
          url: article.get("url"),
          tags: [ ]
        };

        a.tags = a.tags.concat(_.map(article.get("positive_tags"),
          function(tag) {
            return {name: tag.get("name"), type: 'success' };
          }));
        a.tags = a.tags.concat(_.map(article.get("negative_tags"),
          function(tag) {
            return {name: tag.get("name"), type: 'danger' };
          }));

        return a;
      });

      $scope.$apply();
    });
  }
  
  $rootScope.$watch(function() { return LoginService.stateLoggedIn; }, queryPage);
  $rootScope.$watch('pageAddCount', queryPage);
})

.controller('StatisticsController', function($scope, $rootScope, LoginService) {
  $scope.tags = [];
  $scope.tagCount = 0;

  function queryPage() {
    if (LoginService.stateLoggedIn != LoginService.LOGGED_IN) {
      return;
    }

    var UserTag = Parse.Object.extend("UserTag");

    var currentUser = Parse.User.current();
    var query = new Parse.Query(UserTag);
    query.equalTo("user", currentUser);

    query.find({
      success: function(tags) {
        var tagCount = 0;
        for (var i = 0; i < tags.length; i++) {
          var tag = tags[i];
          $scope.tags[i] = {
            name: tag.get("name"),
            positiveCount: tag.get("positiveCount"),
            negativeCount: tag.get("negativeCount")
          };
          tagCount += $scope.tags[i].positiveCount
            + $scope.tags[i].negativeCount;
        }
        $scope.tagCount = tagCount;
        $scope.$apply();
      }
    });
  }

  $rootScope.$watch(function() { return LoginService.stateLoggedIn; }, queryPage);
  $rootScope.$watch('pageAddCount', queryPage);
});
