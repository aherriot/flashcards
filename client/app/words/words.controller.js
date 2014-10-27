'use strict';

angular.module('flashcardsApp')
  .controller('WordsCtrl', ['$scope', 'Word', 'Auth', 'Modal',
    function ($scope, Word, Auth, Modal) {
    $scope.words = Word.query({userID: Auth.getCurrentUser()._id});


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
        text += $scope.words[i].english + ';'
        + $scope.words[i].persian + ';'
        + $scope.words[i].phonetic + ';'
        + $scope.words[i].tags.join(',') + '\n';
      }
      Modal.exportData(text);
    };

    $scope.importWords = function() {

      var lines = $scope.importData.split(/\r\n|\r|\n/g);
      for(var i = 0; i < lines.length; i++) {

        var line = lines[i].split(';');
        if(line.length != 4) {
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
    };

  }]);
