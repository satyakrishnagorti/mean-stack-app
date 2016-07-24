angular.module('userCtrl', ['userService'])

  .controller('userController', function(User) {
    console.log("in userController");
    var vm = this;
    vm.processing = true;

    User.all().success(function(response) {
      vm.processing = false;
      vm.users = response;
      console.log("response:");
      console.log(response);
    });

    vm.deleteUser = function(id) {
      vm.processing = true;
      User.delete(id).success(function(response) {
        User.all().success(function(response) {
            vm.processing = false;
            vm.users = response;
        });
      });
    };
  })

  .controller('newCreateController', function(User) {
    var vm = this;
    vm.type = 'create';

    vm.saveUser = function() {
      vm.processing = true;
      vm.message = '';
      User.create(vm.userData).success(function(response) {
        vm.message = response.message;
        vm.userData = {};
      });
    };
  })

  .controller('userEditController', function($routeParams, User) {
    var vm = this;
    vm.type = 'edit';

    User.get($routeParams.user_id).success(function(data) {
      vm.userData = data;
    });

    vm.saveUser = function() {
      vm.processing = true;
      vm.message = '';

      User.update($routeParams.user_id, vm.userData).success(function(response) {
        vm.processing = false;
        vm.userData = {};
        vm.message = response.message;
      });
    };
  });
