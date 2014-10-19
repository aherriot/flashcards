'use strict';

angular.module('flashcardsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/words', {
        templateUrl: 'app/words/words.html',
        controller: 'WordsCtrl'
      });
  });
