

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

.controller('AddPageController', function($scope, $rootScope, AddPageService) {
  $scope.addPageService = AddPageService;
  $rootScope.pageAddCount = 0;

  $scope.post = function () {
    if (($scope.addPageService.title.length > 0)
        && ($scope.addPageService.url.length > 0)) {
      var Page = Parse.Object.extend("Page");
      var page = new Page();
      var currentUser = Parse.User.current();

      var tagCount = $scope.tags.length;
      var upTags = [];
      var downTags = [];
      for (var index = 0; index < tagCount; index++) {
        var tag = $scope.tags[index];
        if (tag.up) {
          upTags = upTags.concat(tag);
        } else if (tag.down) {
          downTags = downTags.concat(tag);
        }
        delete tag.up;
        delete tag.down;
      }
      if (upTags.length > 0) { 
        var positiveTags = page.relation("positive_tags");
        positiveTags.add(upTags);
      }
      if (downTags.length > 0) {
        var negativeTags = page.relation("negative_tags");
        negativeTags.add(downTags);
      }

      page.set("title", $scope.addPageService.title);
      page.set("url", $scope.addPageService.url);
      page.set("user", currentUser);
      page.setACL(new Parse.ACL(currentUser));

      // Add tags to the user object, first update the tags we already have
      var UserTag = Parse.Object.extend("UserTag");
      for (var t = 0; t < upTags.length; t++) {
	var tag = upTags[t];
        var query = new Parse.Query("UserTag");
        query.equalTo("tag", tag);
        query.limit(1);
        query.find({
          success: function(previousUserTags) {
            if (previousUserTags.length == 0) {
              // Create new UserTag object and initialize
	      var userTag = new UserTag();
	      userTag.set("tag", tag);
	      userTag.set("name", tag.get("name"));
	      userTag.set("positiveCount", 1);
	      userTag.set("negativeCount", 0);
	      userTag.set("user", currentUser);
	      userTag.setACL(new Parse.ACL(currentUser));
	      userTag.save();
	    }
	    else {
	      // Update the user tag
	      var userTag = previousUserTags[0];
	      userTag.set("positiveCount", userTag.get("positiveCount") + 1);
	      userTag.save();
	    }
          }
        });
      }

      // Add tags to the user object, first update the tags we already have
      for (var t = 0; t < downTags.length; t++) {
	var tag = downTags[t];

        var query = new Parse.Query("UserTag");
        query.equalTo("tag", tag);
        query.limit(1);
        query.find({
          success: function(previousUserTags) {
            if (previousUserTags.length == 0) {
              // Create new UserTag object and initialize
	      var userTag = new UserTag();
	      userTag.set("tag", tag);
	      userTag.set("name", tag.get("name"));
	      userTag.set("positiveCount", 0);
	      userTag.set("negativeCount", 1);
	      userTag.set("user", currentUser);
	      userTag.setACL(new Parse.ACL(currentUser));
	      userTag.save();
	    }
	    else {
	      // Update the user tag
	      var userTag = previousUserTags[0];
	      userTag.set("negativeCount", userTag.get("negativeCount") + 1);
	      userTag.save();
	    }
          }
        });
      }

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
    query.limit(20);

    query.find().then(function(articles) {
      $scope.articles = _.map(articles, function(article) {
        var a = {
          title: article.get("title"),
          url: article.get("url"),
          tags: [ ]
        };

        var positiveRelation = article.relation("positive_tags");
        positiveRelation.query().find().then(function(ptags) {
          a.tags = a.tags.concat(_.map(ptags, function(tag) {
            return {name: tag.get("name"), type: 'success' };
          }));
          $scope.$apply();
        });

        var negativeRelation = article.relation("negative_tags");
        negativeRelation.query().find().then(function(ntags) {
          a.tags = a.tags.concat(_.map(ntags, function(tag) {
            return {name: tag.get("name"), type: 'danger' };
          }));
          $scope.$apply();
        });

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
