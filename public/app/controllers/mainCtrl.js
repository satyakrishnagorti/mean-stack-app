angular.module('mainCtrl', [])

  .controller('mainController', function($rootScope, $location, Auth) {
    var vm = this;
    vm.loggedIn = Auth.isLoggedIn();

    $rootScope.$on('$routeChangeStart', function() {
      vm.loggedIn = Auth.isLoggedIn();
      Auth.getUser().then(function(response) {
        vm.user = response.data;
      });
    });

    vm.doLogin = function() {
      vm.processing = true;
      Auth.login(vm.loginData.username, vm.loginData.password)
        .success(function(response) {
          vm.processing = false;
          console.log(response);
          if (response.success)
            $location.path('/users');
          else
            vm.error = response.message;
        });
    };

  });
