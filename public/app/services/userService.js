angular.module('userService', [])

  .factory('User', function($http) {
    var userFactory = {};

    userFactory.get = function(id) {
      return $http.get('/api/users/' + id);
    };

    userFactory.create = function(userData) {
      console.log(userData);
      return $http.post('/api/users/', userData);
    };

    userFactory.all = function() {
      return $http.get('/api/users');
    };

    userFactory.delete = function(id) {
      return $http.delete('/api/users/' + id);
    };

    return userFactory;

  });
