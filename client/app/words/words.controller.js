'use strict';

angular.module('flashcardsApp')
  .controller('WordsCtrl', ['$scope', 'Word', 'Auth',
    function ($scope, Word, Auth) {
    $scope.words = Word.query({user_id: Auth.getCurrentUser()._id});


    $scope.addWord = function() {
      var word = new Word();
      word.user_id = Auth.getCurrentUser()._id;
      word.tags = [];
      word.isNew = true;
      $scope.words.push(word);
    }

  }]);
