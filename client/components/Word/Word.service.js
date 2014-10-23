'use strict';

angular.module('flashcardsApp')
  .factory('Word', function ($resource) {
    return $resource('/api/words/:id', {id: '@id'},
      {
        'update': {method: 'PUT'}
      });
  });
