app.config(['$routeProvider', mainroute]);

function mainroute($routeProvider) {

    $routeProvider.when('/login', {
        templateUrl: 'layouts/login.html',
        controller: 'MainController'
    })

        .when('/home', {
            templateUrl: "layouts/home.html",
            controller: 'MainController'
        })

        .when('/register', {
            templateUrl: "layouts/register.html",
            controller: 'MainController'
        })

        .when('/raterestaurant/:ID', {
            templateUrl: "layouts/raterestaurant.html",
            controller: 'MainController',
            resolve: {
                "check": ['accessFac', '$location', function (accessFac, $location) {
                    if (accessFac.checkPermission()) {    //check if the user has permission -- This happens before the page loads
                        console.log("rooting to home");
                    } else {
                        $location.path('/home');                //redirect user to home if it does not have permission.
                        alert("You don't have access here");
                    }
                }]
            }
        })
        
      .when('/showratings/:ID', {
            templateUrl: "layouts/showratings.html",
            controller: 'MainController'
        })
        
        .otherwise({
            redirectTo: '/home'
        });
};
