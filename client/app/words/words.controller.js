'use strict';

angular.module('flashcardsApp')
  .controller('WordsCtrl', ['$scope', '$location', '$filter', 'Word', 'Auth', 'Modal',
    function ($scope, $location, $filter, Word, Auth, Modal) {

    if(Auth.isLoggedIn() !== true) {
      $location.path('/login');
    }


    $scope.itemsPerPage = 30;
    $scope.currentPage = 1;
    $scope.filteredWords = [];
    $scope.paginatedWords = [];
    $scope.filterText = '';
    $scope.importData = '';


    $scope.pageChanged = function() {
      $scope.paginateWords();
    };

    $scope.filterChanged = function() {
      if($scope.filterText.length > 0) {
        $scope.filteredWords = $filter('filter')($scope.words, $scope.filterText);
      } else {
        $scope.filteredWords = $scope.words;
      }
      $scope.currentPage = 1;
      $scope.paginateWords();
    }


    $scope.paginateWords = function() {

      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.paginatedWords = $scope.filteredWords.slice(begin, end);
    };


    $scope.words = Word.query({userID: Auth.getCurrentUser()._id}, function() {
      $scope.filterChanged();
    });


    $scope.addWord = function() {
      var word = new Word();
      word.userID = Auth.getCurrentUser()._id;
      word.tags = [];
      word.isNew = true;
      $scope.words.push(word);
    };

    $scope.exportWords = function() {
      var text = '';
      for(var i = 0; i < $scope.words.length; i++) {
        text += $scope.words[i].english + ';' +
          $scope.words[i].persian + ';' +
          $scope.words[i].phonetic + ';' +
          $scope.words[i].tags.join(',') + '\n';
      }
      Modal.exportData(text);
    };

    $scope.importWords = function() {

      var lines = $scope.importData.split(/\r\n|\r|\n/g);
      for(var i = 0; i < lines.length; i++) {

        var line = lines[i].split(';');
        if(line.length !== 4) {
          console.log('skipping word');
          continue;
        }

        var word = new Word();
        word.userID = Auth.getCurrentUser()._id;
        word.english = line[0].trim();
        word.persian = line[1].trim();
        word.phonetic = line[2].trim();
        word.tags = line[3].split(',');
        $scope.words.push(word);
        word.$save();
      }

      $location.path('/words');
    };

  }]);
