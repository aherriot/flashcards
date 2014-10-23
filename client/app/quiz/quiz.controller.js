'use strict';

angular.module('flashcardsApp')
  .controller('QuizCtrl', ['$scope', '$filter', 'Word', 'Auth',
    function ($scope, $filter, Word, Auth) {

    $scope.word = null;

    $scope.hideAnswer = true;

    //start a bucket 1
    $scope.bucket = 1;

    $scope.fromLang = 'e';
    $scope.toLang = 'p';
    //Which pair and direction are we quizing for
    //between [english, persian, and phonetic persian]
    $scope.direction = function() {
      return $scope.fromLang + '_to_' + $scope.toLang;
    }

    $scope.tagFilter = "";


    $scope.words = Word.query({user_id: Auth.getCurrentUser()._id},
      function(words) {
        selectWord();
    });

    $scope.reveal = function() {
      $scope.hideAnswer = false;
    };

    $scope.correct = function() {
      $scope.hideAnswer = true;
      $scope.word[$scope.direction()] = Math.min($scope.word[$scope.direction()]+1, 5);
      console.log($scope.word.english  + ': ' + $scope.word[$scope.direction()]);

      Word.update({id: $scope.word._id}, $scope.word, function() {
        selectWord();
      });

    };

    $scope.wrong = function() {
      $scope.hideAnswer = true;
      $scope.word[$scope.direction()] = Math.max($scope.word[$scope.direction()]-1, 1);
      console.log($scope.word.english  + ': ' + $scope.word[$scope.direction()]);
      Word.update({id: $scope.word._id}, $scope.word,function() {
        selectWord();
      });

    };

    function selectWord() {

      if($scope.words.length === 0) {
        $scope.noWords = true;
        return;
      }


      var filteredWordList = [];
      while(true) {

        filteredWordList = $filter('filter')($scope.words, function(word, index) {
          //keep any words that are in the current bucket or smaller

          //word is in too large of a bucket
          if(word[$scope.direction()] > $scope.bucket) {
            return false;
          }

          //we aren't filtering the word list
          if($scope.tagFilter.length === 0) {
            return true;
          }

          //if the tag filter text is a substring of any of the tags.
          for(var index in word.tags) {
            // console.log(tag + ' ' + $scope.tagFilter);
            if(word.tags[index].indexOf($scope.tagFilter) >= 0) {
              return true;
            }
          }
          //otherwise it is not to be displayed.
          return false;
        });

        $scope.noWords = false;
        //if this bucket is empty:
        if(filteredWordList.length === 0) {

          if($scope.bucket === 5) {
            //no words found.
            $scope.noWords = true;
            return;
          } else {
            //if there are no words in this bucket or smaller, so increment
            $scope.bucket = Math.min(5, $scope.bucket+1);
          }

        } else {
          break;
        }
      }

      $scope.word = filteredWordList[Math.floor(Math.random() * filteredWordList.length)];
      $scope.question = $scope.word[getPropertyName($scope.fromLang)];
      $scope.answer = $scope.word[getPropertyName($scope.toLang)];
    }

    $scope.fromLangChanged = function(value) {
      console.log('fromLangChanged:' + value);

      if($scope.fromLang === $scope.toLang) {
        if($scope.fromLang === 'p')
          $scope.toLang = 'e';
        else
          $scope.toLang = 'p';
      }

      //if the question has not been answered yet, keep the same question.
      if($scope.hideAnswer) {
        $scope.question = $scope.word[getPropertyName($scope.fromLang)];
      } else {
        selectWord();
      }

    };

    $scope.toLangChanged = function(value) {
      console.log('toLangChanged:' + value);

      if($scope.fromLang === $scope.toLang) {
        if($scope.toLang === 'p')
          $scope.fromLang = 'e';
        else
          $scope.fromLang = 'p';
      }

      //if the question has not been answered yet, keep the same question.
      if($scope.hideQuestion) {
        $scope.answer = $scope.word[getPropertyName($scope.toLang)];
      } else {
        selectWord();
      }


    };

    $scope.filterChanged = function() {
      $scope.bucket = 1;
      selectWord();
    };

    function getPropertyName(abbrv) {
      if (abbrv === 'e')
        return 'english';

      if (abbrv === 'p')
        return 'persian'

      return 'phonetic'
    }


    function getProgressString(bucket) {
      switch(bucket) {
        case 1: return 'least known';
        case 2: return 'less known';
        case 3: return 'somewhat known';
        case 4: return 'well known';
        case 5: return 'most well known';
      }
    }


  }]);
