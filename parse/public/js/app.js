var democracyApp = angular.module('democracyApp', [
  'ngRoute',
  'democracy.controller',
  'democracy.service'
]);


democracyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/addPage', {
        templateUrl: '/view/addPage.html',
      }).
      when('/listPages', {
        templateUrl: '/view/listPages.html',
      }).
      when('/tagsPerDate', {
        templateUrl: '/view/tagsPerDate.html',
      }).
      when('/accumulatedTags', {
        templateUrl: '/view/accumulatedTags.html',
      }).
      when('/statistics', {
        templateUrl: '/view/statistics.html',
      }).
      when('/login', {
        templateUrl: '/view/login.html',
      }).
      otherwise({
        redirectTo: '/statistics'
      });
  }]);
