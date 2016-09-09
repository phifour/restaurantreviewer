
app.controller('MainController', ['$scope', '$rootScope', '$firebaseArray',
    '$routeParams', 'accessFac', '$location', '$http',
    '$q', 'FourSquareService', 'CheckValuesService', 'AuthentificationService', 'refFac', MainController]);

function MainController($scope, $rootScope, $firebaseArray, $routeParams,
    accessFac, $location, $http, $q, FourSquareService, CheckValuesService, AuthentificationService, refFac) {


    $scope.parseDate = function (x) {
        if (x != null) {
            var date = Date.parse(x);
            var myDate = new Date(date);
            return myDate.getDate() + "." + myDate.getMonth() + "." + myDate.getFullYear() + " at " + myDate.toLocaleTimeString();
            //toTimeString();//toUTCString();//.toLocaleDateString();//toLocaleDateString(); //.toDateString();
        } else {
            return "Not availabe";
        }
    }

    $scope.getAccess = function () {
        accessFac.getPermission();       //call the method in acccessFac to allow the user permission.
    }

    $scope.getloggedinstate = function(x){
        if (x==undefined){
            return 'You are not logged in';
        }else{
            return 'logged in as' + x;
        }
    }

    $scope.username = accessFac.getuser();

    $scope.params = $routeParams;

    $scope.authData = undefined;

    $scope.criteriatype = "All types";
    $scope.criteriaprice = "All prices";
    $scope.criteriarating = "All ratings";
            
    $rootScope.restaurants = [];

    // Create our Firebase reference
    var ref = new Firebase("https://flickering-inferno-6917.firebaseio.com");

    var user_ref = new Firebase("https://flickering-inferno-6917.firebaseio.com/users");

    // find a suitable name based on the meta info given by each provider
    function getName(authData) {
        switch (authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
        }
    }

    // $scope.authfacebook = function () {

    //     ref.authWithOAuthPopup("facebook", function (error, authData) {
    //         if (error) {
    //             console.log("Login Failed!", error);
    //         } else {
    //             // the access token will allow us to make Open Graph API calls
    //             console.log(authData.facebook.accessToken);
    //             console.log(authData.facebook.email);
    //             console.log(authData.facebook.user_likes);
    //             console.log(authData.uid);
      
    //             $rootScope.login = getName(authData);
                
    //             $scope.user = {
    //                 "id": authData.uid,
    //                 "name": getName(authData),
    //                 "provider": authData.provider,
    //                 "email": authData.facebook.email
    //             };

    //             //console.log($scope.user);


    //             // $scope.$apply();

    //             ref.child("users").child(authData.uid).set({
    //                 provider: authData.provider,
    //                 name: getName(authData)
    //             });
                
    //             accessFac.access = true;
    //             accessFac.username = $scope.user.name;                          
    //             $scope.$apply(function() {              
    //                 $location.path('/home');
    //             });
               

    //         }
    //     }, {
    //             remember: "sessionOnly",
    //             scope: "email,user_likes" // the permissions requested
    //         });

    // };


    // var foursquarefcnt = FourSquareService.getvenues;
        
    // function getfoursquare(foursquarekeyword,fourquarecity){
    //     // $scope.foursquarestate.visible = true;
    //     foursquarefcnt(foursquarekeyword,fourquarecity)
    //     .then(function (data, status, headers, config) {  
    //             // console.log("data.respons", data.data.response.venues);
    //             var getphotos = FourSquareService.getphotos;
    //             var getratings = FourSquareService.getratings;
    //             return {photos:getphotos(data.data.response.venues),data:data,ratings:getratings(data.data.response.venues)};

    //         ;}).then(function(data){
                                                
    //             $q.all(data.photos)
    //                 .then(function (responsesArray) {
    //                       $scope.restaurants = [];

    //                     for (var i = 0; i < responsesArray.length; i++) {
    //                        //console.log('responsesArray',responsesArray[i]);                                                      
    //                         var image_url = responsesArray[i].data.response.photos.items[0];
    //                         // console.log('restaurent',data.data.data.response);
    //                         var name = data.data.data.response.venues[i].name;
    //                         var link = data.data.data.response.venues[i].url;
    //                         var address = data.data.data.response.venues[i].location.address;
    //                         var id = data.data.data.response.venues[i].id;
    //                         // console.log('id',id);
    //                         try {
                                
    //                             var myrating = undefined;
    
    //                             var img = { url: image_url.prefix + imgsize + image_url.suffix, name: name,
    //                             address: address, link: link, id:id,
    //                             myrating:myrating,rating:'No rating available'};

    //                             $scope.restaurants.push(img);
    //                             $scope.restaurant_by_id[id] = img;
    //                         }
    //                         catch (err) {
    //                             console.log(name,err.message);
    //                         }

    //                     }

    //                    $scope.apply;                                                                                 
    //                 }); 
                    
                    
    //                 $q.all(data.ratings)
    //                 .then(function (responsesArray) {
    //                     for (var i = 0; i < responsesArray.length; i++) {
    //                       console.log('responsesArrayxxx',responsesArray[i].data.response.venue);
    //                       //console.log('responsesArrayxxx / rating',responsesArray[i].data.response.venue.rating);
    //                       $scope.restaurants[i].rating = responsesArray[i].data.response.venue.rating;
    //                       if (responsesArray[i].data.response.venue.attributes.groups[0].summary==undefined){
    //                            $scope.restaurants[i]['price'] = 'N.A.';
    //                       }else{
    //                            $scope.restaurants[i]['price'] = responsesArray[i].data.response.venue.attributes.groups[0].summary;
    //                       }                                                   
    //                     }
    //                 }); 
                                                                                                             
    //         });
            
          
    // }


    $scope.logout = function () {
        ref.unauth();
        $location.path('/login');
    }

    $scope.removeEvent = function (item) {
        $scope.events.$remove(item).then(function (ref) {
            $scope.events === item.$id; // true
        });
    };

    $scope.checkeditmode = function (item) {
        if (item.editmode == null) {
            return false;
        } else {
            return true;
        }
    };

    $scope.loginwithpassword = function (user) {
        ref.authWithPassword({
            "email": user.email,
            "password": user.password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                accessFac.access = true;
                accessFac.username = user.email;
                $scope.$apply(function () {
                    $location.path('/home');
                });
            }
        });
    };



    $scope.$watch('criteriaprice',
        function (newValue, oldValue) {
            console.log('criteriaprice', $scope.criteriaprice);
        }
        );



    $scope.filterRestaurants = function(element) {

        // if ($scope.criteriatype !== 'All types')
        // {
        //     if (!element.type.includes($scope.criteriatype))
        //         return false;
        // }
        if ($scope.criteriaprice != 'All prices')
        {
            if (element.price != $scope.criteriaprice)
                return false;
        }
        // if ($scope.criteriarating != 'All ratings')
        // {
        //     if (element.rating != $scope.criteriarating)
        //         return false;
        // }
        return true;

    };











};


