app.controller('MainController', ['$scope', '$rootScope', '$firebaseArray',
    '$routeParams', 'accessFac', '$location', '$http',
    '$q', 'FourSquareService', 'CheckValuesService', 'AuthentificationService', 'refFac', MainController]);

function MainController($scope, $rootScope, $firebaseArray, $routeParams,
    accessFac, $location, $http, $q, FourSquareService, CheckValuesService, AuthentificationService, refFac) {


    $scope.stringmissing = CheckValuesService.stringmissing;

    $scope.tooshort = CheckValuesService.tooshort;

    $scope.toolong = CheckValuesService.toolong;

    $scope.missingnumber = CheckValuesService.missingnumber;

    $scope.nolowercaselatter = CheckValuesService.nolowercaselatter;

    $scope.nouppercaseletter = CheckValuesService.nouppercaseletter;

    $scope.illegalchar = CheckValuesService.illegalchar;

    $scope.passwordsmatch = CheckValuesService.passwordsmatch;
    
    $scope.checkemail = CheckValuesService.checkemail;
    
    $scope.inpast = CheckValuesService.inpast;

    $scope.criteriatype = "All types";
    $scope.criteriaprice = "All prices";
    $scope.criteriarating = "All ratings";
    
    $scope.starrating = {};
    $scope.starrating['onestar'] = 1;
    $scope.starrating['twostar'] = 2;
    $scope.starrating['threestar'] = 3;
    $scope.starrating['fourstar'] = 4;
    $scope.starrating['fivestar'] = 5;
            
    $rootScope.restaurants = [];

    var restaurant_ref = refFac.restaurant_ref();

    $scope.username = accessFac.getuser();
    
    $scope.refratings = $firebaseArray(restaurant_ref); 
    
    $scope.testarray = undefined;

    $scope.refratings.$loaded().then(function (x) {
        $scope.testarray = x;
        console.log('testarray',x);
    })
        .catch(function (error) {
            console.log("Error:", error);
        });
    
    $scope.getAccess = function () {
        accessFac.getPermission();       //call the method in acccessFac to allow the user permission.
    }

    $scope.getloggedinstate = function(x){
        if (x==undefined){
            return 'You are not logged in';
        }else{
            return 'logged in as ' + x;
        }
    }
    
    $scope.notloggedin = function(username){
        if (username==undefined){
            return true;
        }else{
            return false;
        }
    }

    $scope.swither = function(x,y,z){
        if (x==undefined){
            return z;
        }else{
            return y;
        }
    }
   
   $scope.booleanswither = function(x,y,z){
        if (x==true){
            return z;
        }else{
            return y;
        }
    }

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

    $scope.logout = function () {
        ref.unauth();
        $location.path('/login');
    }
    
    $scope.login = function () {
        ref.unauth();
        $location.path('/login');
    }
  
    $scope.loginwithpassword = function (user) {
        
        user_ref.orderByChild("email").equalTo(user.email).on("child_added", function (userdata) {
            // console.log('Userdata XXX',userdata.val());
            accessFac.username = userdata.val().name;//email
            $scope.username = userdata.val().name;
            // console.log('$scope.username',$scope.username)
        });
        
        
        ref.authWithPassword({
            "email": user.email,
            "password": user.password
        }, function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                accessFac.access = true;                
                $scope.$apply(function () {
                    $location.path('/home');
                });
            }
        });
    };

     $scope.showDate = function(date1) {
        var myDate1 = new Date(date1);
        return myDate1.getDate() + "." + myDate1.getMonth() + "." + myDate1.getFullYear();        
    }
     
    $scope.rate = 7;
    $scope.max = 5;
    $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ]; 
    
};