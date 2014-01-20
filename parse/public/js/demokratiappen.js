

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
  obj.upTags = [];
  obj.downTags = [];

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

      if ($scope.addPageService.upTags.length > 0) { 
        var positiveTags = page.relation("positive_tags");
        positiveTags.add($scope.addPageService.upTags);
      }
      if ($scope.addPageService.downTags.length > 0) {
        var negativeTags = page.relation("negative_tags");
        negativeTags.add($scope.addPageService.downTags);
      }

      page.set("title", $scope.addPageService.title);
      page.set("url", $scope.addPageService.url);
      page.set("user", currentUser);
      page.setACL(new Parse.ACL(currentUser));

      page.save(null, {
        success: function(page) {
          $scope.addPageService.title = "";
          $scope.addPageService.url = "";
          $scope.addPageService.upTags = [];
          $scope.addPageService.downTags = [];

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

  $scope.toggleTagUp = function(tag) {
    $scope.addPageService.upTags = $scope.addPageService.upTags.concat(tag);
  }
  $scope.toggleTagDown = function(tag) {
    $scope.addPageService.downTags = $scope.addPageService.downTags.concat(tag);
  }

  var query = new Parse.Query("Tag");
  query.find().then(function(tags) {
    $scope.tags = tags;
    $scope.$apply();
  });
})

.controller('ListController', function($scope, $rootScope) {
  function queryPage() {
    var query = new Parse.Query("Page");
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
  
  queryPage();
  $rootScope.$watch('pageAddCount', queryPage);
})

.controller('StatisticsController', function($scope, $rootScope) {
  $scope.positiveTags = [];
  $scope.negativeTags = [];
  $scope.tagCounts = [];

  var updateUI = function() {
    var allTags = $scope.negativeTags.concat($scope.positiveTags);
    $scope.tagCounts = _.chain(allTags).flatten().countBy(function(el) {
      return el.get("name");
    }).pairs().sortBy(function(el) {
      return -el[1];
    }).value();
  };
 
  function queryPage() {
    var Page = Parse.Object.extend("Page"); 
    var query = new Parse.Query(Page);
    query.find({
      success: function(articles) {
      for (var i = 0; i < articles.length; i++) {
        try {
          var article = articles[i];
          var positiveRelation = article.relation("positive_tags");
          positiveRelation.query().find().then(function(ptags) {
            $scope.positiveTags = $scope.positiveTags.concat(ptags);
            updateUI();
            $scope.$apply();
          });

          var negativeRelation = article.relation("negative_tags");
          negativeRelation.query().find().then(function(ntags) {
            $scope.negativeTags = $scope.negativeTags.concat(ntags);
            updateUI();
            $scope.$apply();
          });
        } catch(err) {}
      }
    }});
  }

  queryPage();
  $rootScope.$watch('pageAddCount', queryPage);
});

