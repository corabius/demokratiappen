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

var democracyControllers = angular.module('democracy.controller', ['democracy.service']);

democracyControllers.controller('MainController', [ '$scope', '$location', 'LoginService', function($scope, $location, LoginService) {
  $scope.loginService = LoginService;

  $scope.isActive = function(route) {
    return route === $location.path();
  }
}]);


democracyControllers.controller('LoginController', ['$scope', '$location', 'LoginService', function($scope, $location, LoginService) {
  $scope.loginService = LoginService;

  var states = {
    LOGIN: 0,
    SIGNUP: 1,
    currentState: 0
  }
  $scope.state = states;
  $scope.state.currentState = ($location.path() == '/signup') ? states.SIGNUP : states.LOGIN;

  function redirectIfLoggedIn() {
    if (LoginService.stateLoggedIn == LoginService.LOGGED_IN) {
      if ($location.path() == '/login') {
        // If we already are logged in, goto the statistics page.
        $location.path('/statistics');
      }
    }
  }
  $scope.login = function() {
    LoginService.login().then(function() {
      $scope.$apply(redirectIfLoggedIn());
    });
  };
  $scope.signup = function() {
    LoginService.signup().then(function() {
      $scope.$apply(redirectIfLoggedIn());
    });
  };
  $scope.loginOrSignupFacebook = function() {
    LoginService.loginOrSignupFacebook().then(function() {
      $scope.$apply(redirectIfLoggedIn());
    });
  };
  $scope.loginAsGuest = function() {
    LoginService.username = 'Sandra';
    LoginService.password = 'guest';
    LoginService.login().then(function() {
      $scope.$apply(redirectIfLoggedIn());
    });
  }

  redirectIfLoggedIn();
}]);


democracyControllers.controller('AddPageController', ['$scope', '$rootScope', '$location', '$window', 'LoginService', function($scope, $rootScope, $location, $window, LoginService) {
  $scope.loginService = LoginService
  $rootScope.pageAddCount = 0;

  $scope.$watch(function() {
    return $location.search();
  }, function() {
    var title = $location.search().title;
    if (title) {
      $scope.title = title;
    }
    var url = $location.search().url;
    if (url) {
      $scope.url = url;
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


  // Update user tags table 
  // Return promise when the tags are updated
  function updateUserTags(positiveTags, negativeTags) {
    // Add tags to the user object, first update the tags we already have
    var UserTag = Parse.Object.extend("UserTag");
    var currentUser = Parse.User.current();
    var allTags = positiveTags.concat(negativeTags);

    var query = new Parse.Query("UserTag");
    query.containedIn("tag", allTags);
    query.equalTo("user", currentUser);
    query.limit(allTags.length + 1);

    var promise = query.find().then(function(userTags) {
      var promises = [];

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
        promises.push(userTag.save());
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
          promises.push(userTag.save());
        }
      }
      return Parse.Promise.when(promises);
    });
    return promise;
  }


  $scope.post = function () {
    if (($scope.title.length > 0) && ($scope.url.length > 0)) {
      // Create new page object to fill in
      var Page = Parse.Object.extend("Page");
      var page = new Page();
      var currentUser = Parse.User.current();

      page.set("title", $scope.title);
      page.set("url", $scope.url);
      page.set("user", currentUser);
      page.setACL(new Parse.ACL(currentUser));
      page.set("topic", $scope.topic);

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

      // Update user tags and save the page object
      Parse.Promise.when([
        updateUserTags(upTags, downTags),
        page.save()]).then(function() {
          // Clear the entry from
          $scope.title = "";
          $scope.url = "";
          $scope.topic = undefined;
          $scope.addPageForm.$setPristine();
          $rootScope.pageAddCount++;
          $scope.$apply();
          $window.history.back();
        }, function(error) {
          // Execute any logic that should take place if the save fails.
          // error is a Parse.Error with an error code and description.
          console.log("Error while saving page:");
          console.log(error);
          alert('Failed to create new object, with error code: ' + error.message);
        });
    }
  };

  $scope.abort = function() {
    $window.history.back();
  };

  $scope.resetTag = function(tag) {
    tag.up = false;
    tag.down = false;
  };

  function getTopics() {
    $scope.topics = [];

    var query = new Parse.Query("Tag");
    query.equalTo("type", "topic");
    query.find().then(function (topics) {
      $scope.topics = _.sortBy(topics, function(topic) {
        return topic.get("name");
      });

      $scope.$apply();
    }, function (error) {
      alert("Connection to Parse failed, no topics collected.");
    });
  }

  function getTags() {
    var Tag = Parse.Object.extend("Tag");

    // Convert tag id to Tag objects with a name
    $scope.tags = [];
    var tagsArg = $location.search().tags;

    if (tagsArg) {
      var tagIds = filterTags(tagsArg);

      var query = new Parse.Query("Tag");
      query.containedIn("objectId", tagIds);
      query.find().then(function (tags) {
        $scope.tags = tags;
        $scope.$apply();
      }, function (error) {
        alert("Connection to Parse failed, no tags collected.");
      });
    }
  }

  function filterTags(tagsArg) {
    function splitCollectionHelper(collection) { return collection.split(","); }

    var tagIds = splitCollectionHelper(tagsArg);
    var relevanceArg = splitCollectionHelper($location.search().relevance);

    var parsedRelevanceArg = _.map(relevanceArg, function(relevance) {
      return parseFloat(relevance);
    });

    var tagsWithRelevance = _.zip(tagIds, parsedRelevanceArg);

    var sortedDescendingListOfRelevance = _.sortBy(tagsWithRelevance, function(tagWithRelevance) {
      return tagWithRelevance[1];
    }).reverse();

    var tagIdList = _.pluck(_.take(sortedDescendingListOfRelevance, 5), [0]);

    return tagIdList;
  }

  getTags();
  getTopics();
}]);


democracyControllers.controller('ListPagesController', ['$scope', '$rootScope', 'LoginService', function($scope, $rootScope, LoginService) {
  $scope.loginService = LoginService;

  function queryPage() {
    if (LoginService.stateLoggedIn != LoginService.LOGGED_IN) {
      return;
    }

    var currentUser = Parse.User.current();

    var query = new Parse.Query("Page");
    query.equalTo("user", currentUser);
    query.include(["positive_tags"]);
    query.include(["negative_tags"]);
    query.include(["topic"]);
    query.limit(20);

    query.find().then(function(articles) {
      $scope.articles = _.map(articles, function(article) {
        var a = {
          title: article.get("title"),
          url: article.get("url"),
          topic: article.get("topic"),
          tags: [ ]
        };

        a.tags = a.tags.concat(_.map(article.get("positive_tags"),
          function(tag) {
            var tagName = 'unknown';
            if (tag) {
              tagName = tag.get('name');
            }
            return {name: tagName, type: 'success' };
          }));
        a.tags = a.tags.concat(_.map(article.get("negative_tags"),
          function(tag) {
            var tagName = 'unknown';
            if (tag) {
              tagName = tag.get('name');
            }
            return {name: tagName, type: 'danger' };
          }));

        return a;
      });

      $scope.$apply();
    });
  }
  
  $rootScope.$watch(function() { return LoginService.stateLoggedIn; }, queryPage);
  $rootScope.$watch('pageAddCount', queryPage);
}]);

democracyControllers.controller('StatisticsController', ['$scope', '$rootScope', 'LoginService', function($scope, $rootScope, LoginService) {
  $scope.loginService = LoginService;
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
}]);

democracyControllers.controller('TagsPerDateController', ['$scope', '$rootScope', 'LoginService', function($scope, $rootScope, LoginService) {

  var currentUser = Parse.User.current();
  var pageQuery = new Parse.Query("Page");
  pageQuery.equalTo("user", currentUser);
  pageQuery.include("positive_tags");
  pageQuery.include("negative_tags");

  pageQuery.descending("createdAt");

  pageQuery.find().then(function(pages) {
    var result = [];
    for (var i = 0; i < pages.length; i++) {
      var positiveTags = pages[i].get("positive_tags");
      if (positiveTags) {
        for (var j = 0; j < positiveTags.length; j++) {
          var positiveTag = positiveTags[j];
          if (positiveTag) {
            var resultTag = {
              id: positiveTag.id,
              date: pages[i].createdAt,
              name: positiveTag.get("name"),
              score: 1
            };
            result[result.length] = resultTag;
          }
        }
      }

      var negativeTags = pages[i].get("negative_tags");
      if (negativeTags) {
        for (var j = 0; j < negativeTags.length; j++) {
          var negativeTag = negativeTags[j];
          if (negativeTag) {
            var resultTag = {
              id: negativeTag.id,
              date: pages[i].createdAt,
              name: negativeTag.get("name"),
              score: -1
            };
            result[result.length] = resultTag;
          }
        }
      }
    }

    // Format the data as csv
    var csvResult = "id; date; name; score\n";
    for (var i = 0; i < result.length; i++) {
      csvResult += result[i].id + ";" + result[i].date + ";" + result[i].name + ";" + result[i].score + "\n";
    }

    $scope.tags = csvResult;
    $scope.$apply();
  }, function (error) {
    alert(error);
  });
}]);


democracyControllers.controller('AccumulatedTagsController', ['$scope', '$rootScope', 'LoginService', function($scope, $rootScope, LoginService) {

  var currentUser = Parse.User.current();
  var userTagQuery = new Parse.Query("UserTag");
  userTagQuery.equalTo("user", currentUser);

  userTagQuery.find().then(function(userTags) {
    var result = [];
    for (var i = 0; i < userTags.length; i++) {
      var resultTag = {
        id: userTags[i].id,
        name: userTags[i].get("name"),
        score: userTags[i].get("negativeCount") + userTags[i].get("positiveCount")
      };
      result[result.length] = resultTag;
    }

    result.sort(function(a, b) { return b.score - a.score; });

    // Format the data as csv
    var csvResult = "id; name; score\n";
    for (var i = 0; i < result.length; i++) {
      csvResult += result[i].id + ";" + result[i].name + ";" + result[i].score + "\n";
    }

    $scope.tags = csvResult;
    $scope.$apply();
  }, function (error) {
    alert(error);
  });
}]);

democracyControllers.controller('ListCollectionsController', ['$scope', '$rootScope', 'LoginService', function($scope, $rootScope, LoginService) {

  Parse.Cloud.run('listCollections', {}).then(function(result) {
    $scope.tags = result;
    $scope.$apply();
  }, function (error) {
    alert(error);
  });
}]);
