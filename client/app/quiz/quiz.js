'use strict';

angular.module('flashcardsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/quiz', {
        templateUrl: 'app/quiz/quiz.html',
        controller: 'QuizCtrl'
      });
  });
