'use strict';


angular.module('flashcardsApp')
  .directive('inlineEdit', function() {
    return {
      restrict: 'E',
      scope: {
        word: '=data'
      },
      replace: true,
      templateUrl: 'components/inlineEdit/inlineEdit.html',
      controller: function($scope, $element, Word, Modal) {

        if($scope.word.isNew) {
          $('input[ng-model="view.persian"]').last().focus();
        }

        $scope.view = {
          english: $scope.word.english,
          persian: $scope.word.persian,
          phonetic: $scope.word.phonetic,
          tags: $scope.word.tags.join(','),
          editorEnabled: $scope.word.isNew
        };

        $scope.enableEditor = function() {
          $scope.view.editorEnabled = true;
          $scope.view.english = $scope.word.english;
          $scope.view.persian = $scope.word.persian;
          $scope.view.phonetic = $scope.word.phonetic;
          $scope.view.tags = $scope.word.tags.join(',');
        };

        $scope.disableEditor = function() {
            if($scope.word.isNew) {
              var parentScope = $element.parent().scope();
              parentScope.words.splice(parentScope.words.indexOf($scope.word),1);
            } else {
              $scope.view.editorEnabled = false;
              $scope.view.english = $scope.word.english;
              $scope.view.persian = $scope.word.persian;
              $scope.view.phonetic = $scope.word.phonetic;
              $scope.view.tags = $scope.word.tags.join(',');
            }
        };

        $scope.save = function() {

            $scope.word.english = $scope.view.english;
            $scope.word.persian = $scope.view.persian;
            $scope.word.phonetic = $scope.view.phonetic;
            $scope.word.tags = $scope.view.tags.split(',');

            if($scope.word.isNew) {
              $scope.word.$save(function() {
                $scope.word.isNew = false;
                $scope.disableEditor();
              });
            } else {
              Word.update({id: $scope.word._id}, $scope.word, function() {
                $scope.disableEditor();
              });
            }

        };

        $scope.deleteWord = Modal.confirm.delete(function(word) {
          Word.remove({id: word._id}, function() {
            var parentScope = $element.parent().scope();
            parentScope.words.splice(parentScope.words.indexOf(word),1);
          });
        });



      }

    }
  });
