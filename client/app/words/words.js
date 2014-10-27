'use strict';

angular.module('flashcardsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/words/bulkadd', {
        templateUrl: 'app/words/bulkadd.html',
        controller: 'WordsCtrl'
      })
      .when('/words', {
        templateUrl: 'app/words/words.html',
        controller: 'WordsCtrl'
      });
  });
