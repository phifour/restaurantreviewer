 
app.controller('AddEventController', ['$scope', '$rootScope','CheckValuesService','FourSquareService','$q','$location','refFac','accessFac','$firebaseArray', AddEventController]);

function AddEventController($scope, $rootScope, CheckValuesService, FourSquareService,$q,$location,refFac,accessFac,$firebaseArray) {  
    
    $scope.username = accessFac.getuser();
        
    if (accessFac.getuser()==undefined){
        $scope.loggedin = false;
    }else{
        $scope.loggedin = true;
    }

    $scope.authData = undefined;
    // Create our Firebase reference
    var restaurant_ref = refFac.restaurant_ref();
    
    $scope.restaurat_ratings = {};
    
    $scope.restaurants = [];
    
    $scope.restaurants = $rootScope.restaurants;
    
    $scope.refratings = $firebaseArray(restaurant_ref); 
   
    $scope.restauranttypes = ['asian','italian','burger','sushi'];
    $scope.restauranttype = 'sushi';
    
    $scope.foursquarecities = ['Vienna,AT', 'Berlin,DE', 'Amsterdam,NL'];
    $scope.foursquarecity = 'Vienna,AT';
    
    //sorting options
    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchFish   = '';     // set the default search/filter term
    $scope.reverseSort = false;
    
    $scope.showRating = function(x,y){
        var out = "No rating on myRestaurant"
        if (x!=undefined && y != undefined){
            out =  x + ' ('+ y + ' ratings)';
        }
        return out;
    }
        
    $scope.notloggedin = function(username){
        if (username==undefined){
            return true;
        }else{
            return false;
        }
    }
        
    $scope.restaurant_by_id = {};
    
    $scope.testarray = undefined;
   
    function updateRatings() {
        $scope.restaurat_ratings = {};
        var ref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants');
        ref.orderByChild("myrating").on("child_added", function (restaurant) {
            var dummyref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + restaurant.key());
            dummyref.orderByChild("myrating").on("child_added", function (userrating) {                
                var rated_by_user = false;                
                if (userrating.val().user == $scope.username) rated_by_user = true;                
                if ($scope.restaurat_ratings[restaurant.key()] == undefined){                    
                    $scope.restaurat_ratings[restaurant.key()] = {rating:userrating.val().myrating,name:userrating.val().name,nratings:1,
                    rated_by_user:rated_by_user};                
                }else{
                    var rated_by_user = false;                
                    if (userrating.val().user == $scope.user) rated_by_user = true;                    
                    $scope.restaurat_ratings[restaurant.key()].rating = ($scope.restaurat_ratings[restaurant.key()].rating + userrating.val().myrating)/2;
                    $scope.restaurat_ratings[restaurant.key()].nratings =  $scope.restaurat_ratings[restaurant.key()].nratings + 1;
                    $scope.restaurat_ratings[restaurant.key()].rated_by_user = rated_by_user;
                }
                // console.log(userrating.key() + " 000 was rated 000" + userrating.val().user + ' with ' + userrating.val().myrating);
            });            
        });
    }

    updateRatings();

    $scope.refratings.$loaded().then(function (x) {
        $scope.testarray = x;        
    })
     .catch(function (error) {
            console.log("Error:", error);
     });
     
   
    $scope.submitRating = function (myrating, review, id) {
        //var obj = {id:img.id,user:$scope.username,myrating:img.myrating};
        var obj = { user: $scope.username, myrating: myrating, review: review };
        var element = $scope.testarray.$getRecord(id);        
        // console.log('element',element);
        
        if (element == undefined) {
            //case1 : there is no rating at all
            var tempref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + id);
            tempref.push(obj);// tempref.update(obj);
            $location.path('/home');
        } else {
            //case2 : there are already ratings - check if you have have already rated this restaurant
            var rated_by_this_user = false;           
            //search all existing ratings
            for (var x in element) {
                if (element[x] instanceof Object) {
                    if (element[x].user == $scope.username) rated_by_this_user = true;
                }
            }

            // if (rated_by_this_user) {
            //     console.log('You have already rated this restaurant');
            // }

            if (rated_by_this_user == false) {
                //    console.log('addding rating to existing ratings');
                var tempref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + id);
                tempref.push(obj);// tempref.update(obj); 
                $location.path('/home');
            }
        }
    }
    
    var foursquarefcnt = FourSquareService.getvenues;
        
    function getfoursquare(foursquarekeyword,fourquarecity){
        // $scope.foursquarestate.visible = true;
        foursquarefcnt(foursquarekeyword,fourquarecity)
        .then(function (data, status, headers, config) {  
                // console.log("data.respons", data.data.response.venues);
                var getphotos = FourSquareService.getphotos;
                var getratings = FourSquareService.getratings;
                return {photos:getphotos(data.data.response.venues),data:data,ratings:getratings(data.data.response.venues)};

            ;}).then(function(data){
                                                
                $q.all(data.photos)
                    .then(function (responsesArray) {
                          $scope.restaurants = [];

                        for (var i = 0; i < responsesArray.length; i++) {
                           //console.log('responsesArray',responsesArray[i]);                                                      
                            var image_url = responsesArray[i].data.response.photos.items[0];
                            // console.log('restaurent',data.data.data.response);
                            var name = data.data.data.response.venues[i].name;
                            var link = data.data.data.response.venues[i].url;
                            var address = data.data.data.response.venues[i].location.address;
                            var id = data.data.data.response.venues[i].id;
                            // console.log('id',id);
                            try {
                                
                                var myrating = undefined;
    
                                var img = { url: image_url.prefix + imgsize + image_url.suffix, name: name,
                                address: address, link: link, id:id,
                                myrating:myrating,rating:'No rating available'};

                                $scope.restaurants.push(img);
                                $scope.restaurant_by_id[id] = img;
                            }
                            catch (err) {
                                console.log(name,err.message);
                            }

                        }

                       $scope.apply;                                                                                 
                    }); 
                    
                    
                    $q.all(data.ratings)
                    .then(function (responsesArray) {
                        for (var i = 0; i < responsesArray.length; i++) {
                        //   console.log('responsesArrayxxx',responsesArray[i].data.response.venue);
                          //console.log('responsesArrayxxx / rating',responsesArray[i].data.response.venue.rating);
                          $scope.restaurants[i].rating = responsesArray[i].data.response.venue.rating;
                          if (responsesArray[i].data.response.venue.attributes.groups[0].summary==undefined){
                               $scope.restaurants[i]['price'] = 'N.A.';
                          }else{
                               $scope.restaurants[i]['price'] = responsesArray[i].data.response.venue.attributes.groups[0].summary;
                          }                                                   
                        }
                    }); 
                                                                                                             
            });
            
          
    }
    
    $scope.foursquare = getfoursquare;
   
    if ($rootScope.restaurants.length == 0){
        console.log('Loading');
        getfoursquare($scope.restauranttype,$scope.foursquarecity);
        $rootScope.restaurants = $scope.restaurants;
    }

    $scope.$watch('restauranttype',
        function (newValue, oldValue) {
            console.log('restauranttype', $scope.restauranttype);
            getfoursquare($scope.restauranttype, $scope.foursquarecity);
        }
        );

    $scope.$watch('foursquarecity',
        function (newValue, oldValue) {
            console.log('foursquarecity', $scope.foursquarecity);
            getfoursquare($scope.restauranttype, $scope.foursquarecity);
        }
        );
    
    
    $scope.rate = 7;
    $scope.max = 10;
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
    
}