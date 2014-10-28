'use strict';

angular.module('flashcardsApp')
  .controller('QuizCtrl', ['$scope', '$location', '$filter', 'Word', 'Auth',
    function ($scope, $location, $filter, Word, Auth) {

    if(Auth.isLoggedIn() !== true) {
      $location.path('/login');
    }

    //The word currently being quized.
    $scope.word = null;

    //whether the answer is shown yet.
    $scope.hideAnswer = true;

    //The bucket to look for cards in.
    $scope.bucket = 1;

    $scope.bucketCounts = [0,0,0,0,0];

    //The default question and answer direction (Persian -> English)
    $scope.fromLang = 'p';
    $scope.toLang = 'e';
    //Which pair and direction are we quizing for
    //between [english, persian, and phonetic persian]
    $scope.direction = function() {
      return $scope.fromLang + '_to_' + $scope.toLang;
    };

    //The filtering string to filter our word list with
    $scope.tagFilter = '';

    //fetch the words from the server.
    //TODO: share scope or at least this data with Words controller.
    $scope.words = Word.query({userID: Auth.getCurrentUser()._id},
      function() {
        selectWord();
    });

    //show the answer
    $scope.reveal = function() {
      $scope.hideAnswer = false;
    };

    //The response was correct, so we move the word up one bucket.
    $scope.correct = function() {
      $scope.hideAnswer = true;
      $scope.word[$scope.direction()] = Math.min($scope.word[$scope.direction()]+1, 5);
      Word.update({id: $scope.word._id}, $scope.word, function() {
        selectWord();
      });

    };

    //the response was incorrect, so we move this word back to the first bucket
    $scope.wrong = function() {
      $scope.hideAnswer = true;
      $scope.word[$scope.direction()] = 1;
      Word.update({id: $scope.word._id}, $scope.word,function() {
        selectWord();
      });

    };

    //select which word to use next
    function selectWord() {

      if($scope.words.length === 0) {
        $scope.noWords = true;
        return;
      }

      var filteredWordList = [];
      while(true) {



        filteredWordList = filterWordList();

        var total = 0;
        for(var i = 0; i < 5; i++) {
          total += $scope.bucketCounts[i];
        }
        for(i = 0; i < 5; i++) {
          $scope.bucketCounts[i] = ($scope.bucketCounts[i] / total) * 100;
        }

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

    function filterWordList() {
      $scope.bucketCounts = [0,0,0,0,0];
      var filteredWordList = [];

      for(var i = 0; i < $scope.words.length; i++) {
        var word = $scope.words[i];
        var wordBucket = word[$scope.direction()];



        //word is in too large of a bucket
        if(wordBucket > $scope.bucket) {
          $scope.bucketCounts[wordBucket-1]++;
          continue;
        }

        //we aren't filtering the word list
        if($scope.tagFilter.length === 0) {
          $scope.bucketCounts[wordBucket-1]++;
          filteredWordList.push(word);
          continue;
        }

        //if the tag filter text is a substring of any of the tags.
        for(var tagIndex in word.tags) {
          if(word.tags[tagIndex].indexOf($scope.tagFilter) >= 0) {
            $scope.bucketCounts[wordBucket-1]++;
            filteredWordList.push(word);
            continue;
          }
        }
        //otherwise, skip the word
      }

      return filteredWordList;

    }

    $scope.fromLangChanged = function() {
      if($scope.fromLang === $scope.toLang) {
        if($scope.fromLang === 'p') {
          $scope.toLang = 'e';
        } else {
          $scope.toLang = 'p';
        }
      }

      //if the question has not been answered yet, keep the same question.
      if($scope.hideAnswer) {
        $scope.question = $scope.word[getPropertyName($scope.fromLang)];
      } else {
        selectWord();
      }

    };

    $scope.toLangChanged = function() {

      if($scope.fromLang === $scope.toLang) {
        if($scope.toLang === 'p') {
          $scope.fromLang = 'e';
        } else {
          $scope.fromLang = 'p';
        }
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
      if (abbrv === 'e') {
        return 'english';
      }

      if (abbrv === 'p') {
        return 'persian';
      }

      return 'phonetic';
    }


  }]);
