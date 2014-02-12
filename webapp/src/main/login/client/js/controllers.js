/* jshint laxcomma: true */
(function() {
	'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

	//console.log("hoping for the best");
	//console.log("username: " $scope.username + ", password: " + $scope.password);
    $scope.rememberme = true;
    $scope.login = function() {
		console.log("inside login");
		console.log("username: " + $scope.username);
		console.log("password: " + $scope.password);
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('HomeCtrl',
['$rootScope', '$scope', '$http', function($rootScope, $scope, $http) {
    $scope.stats = [];
    $scope.statsArray = [];
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $http.get('/js/mock_json/stats.json').success(function (data) {

        $scope.numberOfPages = function () {
            return Math.ceil($scope.stats.length / $scope.pageSize);
        };
        $scope.stats = data;
        angular.forEach($scope.stats, function (value) {
            $scope.statsArray.push(value.name);
        });
		console.log($scope);
    });


}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('PrivateCtrl',
['$rootScope', function($rootScope) {
}]);


angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

})();
