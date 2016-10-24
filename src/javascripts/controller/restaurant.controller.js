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
    
    // $scope.restaurat_ratings = {};
    
    $scope.restaurants = [];
    
    $scope.restaurant_by_id = {};
       
    $scope.restauranttypes = ['asian','italian','burger','sushi'];
    $scope.restauranttype = 'sushi';
    
    // $scope.foursquarecities = ['Vienna,AT', 'Berlin,DE', 'Amsterdam,NL'];
    $scope.foursquarecity = 'Vienna,AT';
    
    $scope.objtoarray = function (obj) {
        var array = [];
        for (x in obj) {
            array.push(obj[x]);
        }
        return array;
    }

    function convertRating(x) {

        if (x != undefined) {
            if (x < 4) {
                return "Low";
            } else if (x > 4 && x <= 6) {
                return "Medium";
            }
            else {
                return "High";
            }
        } else {
            return "N.A.";
        }

    }

    $scope.filterRestaurants = function (element) {
        var tmap = {};
        tmap['1 Star'] = 1;
        tmap['2 Star'] = 2;
        tmap['3 Star'] = 3;
        tmap['4 Star'] = 4;
        tmap['5 Star'] = 5;

        if ($scope.criteriatype !== 'All types') {
            if (!element.type.includes($scope.criteriatype))
                return false;
        }
        if ($scope.criteriaprice != 'All prices') {
            if (element.price != $scope.criteriaprice)
                return false;
        }
        if ($scope.criteriarating != 'All ratings') {
            if (element.rating != tmap[$scope.criteriarating])
                return false;
        }
        return true;

    };
 
     $scope.submitRating = function (reviewer, myrating, review, restaurant) {
        //var obj = {id:img.id,user:$scope.username,myrating:img.myrating};
        // var obj = { user: $scope.username, myrating: myrating, review: review };
        var today = new Date();
        var obj = {date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toString(),user: reviewer, myrating: myrating, review: review };
        console.log('obj',obj);        
        var tempref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + restaurant.id);
        tempref.push(obj);// tempref.update(obj); 
        
        restaurant.reviewer = undefined;
        restaurant.myrating = undefined;
        restaurant.review = undefined;
        
        updateRatings();
                        
        //this part is only relevant for user management
        // var element = $scope.testarray.$getRecord(id);        
        // console.log('element',element);

        // if (element == undefined) {
        //     //case1 : there is no rating at all
        //     var tempref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + id);
        //     tempref.push(obj);// tempref.update(obj);
        //     // $location.path('/home');
        // } else {
        //     //case2 : there are already ratings - check if you have have already rated this restaurant
        //     var rated_by_this_user = false;           
        //     //search all existing ratings
        //     for (var x in element) {
        //         if (element[x] instanceof Object) {
        //             if (element[x].user == $scope.username) rated_by_this_user = true;
        //         }
        //     }

        //     // if (rated_by_this_user) {
        //     //     console.log('You have already rated this restaurant');
        //     // }

        //     if (rated_by_this_user == false) {
        //         //    console.log('addding rating to existing ratings');
        //         var tempref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + id);
        //         tempref.push(obj);// tempref.update(obj); 
        //         // $location.path('/home');
        //     }
        // }
    }
    
    $scope.showRating = function(x,y){
        var out = "No rating on myRestaurant"
        if (x!=undefined && y != undefined){
            out =  x + ' ('+ y + ' ratings)';
        }
        return out;
    }
                
    function updateRatings() {
        // $scope.restaurat_ratings = {};
        var ref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants');
        ref.orderByChild("myrating").on("child_added", function (restaurant) {
            var dummyref = new Firebase('https://flickering-inferno-6917.firebaseio.com/restaurants/' + restaurant.key());
            var sumrating = 0;
            var cnt = 0;
            dummyref.orderByChild("myrating").on("child_added", function (userrating) {                
                // var rated_by_user = false;                                
                // console.log('user rating',userrating.val());
                sumrating = sumrating + parseInt(userrating.val().myrating);         
                cnt = cnt + 1;  
                              
                //for user management
                // if (userrating.val().user == $scope.username) rated_by_user = true;                
                // if ($scope.restaurat_ratings[restaurant.key()] == undefined){                    
                //     $scope.restaurat_ratings[restaurant.key()] = {rating:userrating.val().myrating,name:userrating.val().name,nratings:1,
                //     rated_by_user:rated_by_user};                
                // }else{
                //     var rated_by_user = false;                
                //     if (userrating.val().user == $scope.user) rated_by_user = true;                    
                //     $scope.restaurat_ratings[restaurant.key()].rating = ($scope.restaurat_ratings[restaurant.key()].rating + userrating.val().myrating)/2;
                //     $scope.restaurat_ratings[restaurant.key()].nratings =  $scope.restaurat_ratings[restaurant.key()].nratings + 1;
                //     $scope.restaurat_ratings[restaurant.key()].rated_by_user = rated_by_user;
                // }                
                // console.log(userrating.key() + " 000 was rated 000" + userrating.val().user + ' with ' + userrating.val().myrating);
            });
                                      
            //   $scope.restaurat_ratings[restaurant.key()] = {
            //       rating:Math.round(sumrating/cnt), nratings:cnt     
            //   }
              

                console.log('$scope.restaurant_by_id[restaurant.key()]',$scope.restaurant_by_id[restaurant.key()]);
                
                if ($scope.restaurant_by_id[restaurant.key()]!=undefined){
                $scope.restaurant_by_id[restaurant.key()].rating = Math.round(sumrating/cnt);
                $scope.restaurant_by_id[restaurant.key()].nratings = cnt;
                //console.log('property set');
              }
            //   console.log('Average rating', $scope.restaurat_ratings[restaurant.key()]);
                           
        });
    }

       
    var foursquarefcnt = FourSquareService.getvenues;
        
    function getfoursquare(foursquarekeyword,fourquarecity){
        // $scope.foursquarestate.visible = true;
        foursquarefcnt(foursquarekeyword,fourquarecity)
        .then(function (data, status, headers, config) {  
                // console.log("data.respons", data.data.response.venues);
                var getphotos = FourSquareService.getphotos;
                var getratings = FourSquareService.getratings;
                var gethours = FourSquareService.gethours;
                return {photos:getphotos(data.data.response.venues),hours:gethours(data.data.response.venues),data:data,ratings:getratings(data.data.response.venues)};

            ;}).then(function(data){
                                                                                                                                       
              console.log('DATA LOAD',data);                               
              //hours[0].$$state.value.date.response.hours                                     
                                                                                                                                                                                                              
                $q.all(data.photos)
                    .then(function (responsesArray) {
                        //   $scope.restaurants = [];

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
                                address: address, link: link,
                                id:id,
                                type:foursquarekeyword,
                                myrating:myrating,
                                hours:undefined,
                                rating:undefined,
                                nratings:undefined,
                                price:undefined                                
                                };

                                if (name != undefined) {
                                    // $scope.restaurants.push(img);
                                    $scope.restaurant_by_id[id] = img;
                                }

                            }
                            catch (err) {
                                console.log(name,err.message);
                            }

                        }
                       $scope.apply;             
                       
                                                 updateRatings();
                                                 
                     $q.all(data.ratings)
                    .then(function (responsesArray) {
                        for (var i = 0; i < responsesArray.length; i++) {
                          //console.log('responsesArrayxxx / rating',responsesArray[i].data.response.venue.rating);
                        //   $scope.restaurants[i].rating = convertRating(responsesArray[i].data.response.venue.rating);   
                         var id = data.data.data.response.venues[i].id;
                           console.log('id ',i,'check check');      
                           if (responsesArray[i].data.response.venue.attributes.groups[0] != undefined) {
                               if (responsesArray[i].data.response.venue.attributes.groups[0].hasOwnProperty('summary') == false) {
                                   //if (responsesArray[i].data.response.venue.attributes.groups[0].summary==undefined){
                                   //    $scope.restaurants[i]['price'] = 'N.A.';                               
                                   //$scope.restaurant_by_id[$scope.restaurants[i].id]['price'] = 'N.A.';
                                   $scope.restaurant_by_id[id].price = 'N.A.';
                               } else {
                                   //$scope.restaurants[i]['price'] = responsesArray[i].data.response.venue.attributes.groups[0].summary;
                                   $scope.restaurant_by_id[id].price = responsesArray[i].data.response.venue.attributes.groups[0].summary;
                               }
                           }                                              
                        }
                    }); 
                       
                       
                  $q.all(data.hours)
                  .then(function (responsesArray) {
                      var dd = {0:'Son',1:'Mon',2:'Tue',3:'Wed',4:'Thu',5:'Fri',6:'Sat'};
                      for (var i = 0; i < responsesArray.length; i++) {                                                    
                          console.log('response hours',responsesArray[i]);                             
                          var hours = {};
                         var id = data.data.data.response.venues[i].id;
                          if (responsesArray[i].data.response.hours.timeframes != undefined){
                              
                               for (var j = 0; j < responsesArray[i].data.response.hours.timeframes.length; j++) {
                                var days = responsesArray[i].data.response.hours.timeframes[j].days;
                                var start_time = responsesArray[i].data.response.hours.timeframes[j].open[0].start;
                                var end_time  = responsesArray[i].data.response.hours.timeframes[j].open[0].end;

                            for (var day in days) {                            
                                hours[dd[day]] = start_time + ' - ' + end_time;                            
                            }
    
                          }                              
                            // console.log('hours',hours);                                
                            // $scope.restaurants[i]['hours'] =  hours;
                             if ($scope.restaurant_by_id[id]!=undefined) $scope.restaurant_by_id[id].hours = hours;
                            // console.log('response hours size',responsesArray[i].data.response.hours.timeframes);                    
                          }else{
                              //no time info available
                            for (var j = 0; j < 7; j++) {
                                hours[dd[j]] = 'NA'; 
                            }
                            // $scope.restaurants[i]['hours'] =  hours;
                             if ($scope.restaurant_by_id[id]!=undefined) $scope.restaurant_by_id[id].hours = hours;
                              
                          }

                      }
                                            

                  });     
                       
                       
                       
                                                                                           
                    }); 
                                                                                                                                                                                                
            });
            
          
    }
    
    $scope.foursquare = getfoursquare;
   
    if ($scope.restaurants.length == 0){
        console.log('Loading');
        $scope.restaurants = [];
        getfoursquare("sushi",$scope.foursquarecity);
        getfoursquare("burger",$scope.foursquarecity);
        getfoursquare("italian",$scope.foursquarecity);
        getfoursquare("asian",$scope.foursquarecity);                        
    }
    
    
}