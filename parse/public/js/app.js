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

var democracyApp = angular.module('democracyApp', [
  'ngRoute',
  'democracy.controller',
  'democracy.service'
]);


democracyApp.config(['$routeProvider',
  function($routeProvider) {
    var base = ''
    $routeProvider.
      when('/addPage', {
        templateUrl: base + '/view/addPage.html',
      }).
      when('/listPages', {
        templateUrl: base + '/view/listPages.html',
      }).
      when('/tagsPerDate', {
        templateUrl: base + '/view/tagsPerDate.html',
      }).
      when('/accumulatedTags', {
        templateUrl: base + '/view/accumulatedTags.html',
      }).
      when('/listCollections', {
        templateUrl: '/view/listCollections.html',
      }).
      when('/statistics', {
        templateUrl: base + '/view/statistics.html',
      }).
      when('/login', {
        templateUrl: base + '/view/login.html',
      }).
      when('/signup', {
        templateUrl: base + '/view/login.html',
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);
