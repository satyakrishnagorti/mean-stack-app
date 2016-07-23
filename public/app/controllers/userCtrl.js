angular.module('userCtrl', ['userService'])

  .controller('userController', function(User) {
    console.log("in userController");
    var vm = this;
    vm.processing = true;

    User.all().success(function(response) {
      vm.processing = false;
      vm.users = response;
      console.log("response:");
      console.log(reponse);
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
  });
