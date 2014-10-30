'use strict';

angular.module('flashcardsApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window) {

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');

        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
