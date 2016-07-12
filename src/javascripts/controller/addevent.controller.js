 
app.controller('AddEventController', ['$scope', 'CheckValuesService','FourSquareService','$q','$location','refFac','accessFac', AddEventController]);

function AddEventController($scope, CheckValuesService, FourSquareService,$q,$location,refFac,accessFac) {  
    
    $scope.username = accessFac.getuser();

    $scope.stringmissing = CheckValuesService.stringmissing;

    // $scope.params = $routeParams;

    $scope.authData = undefined;
    // Create our Firebase reference
    var restaurant_ref = refFac.restaurant_ref();
     
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

    $scope.locations = [];

    $scope.selectedlocation = undefined;

    $scope.guest = "";

    $scope.images = [];

    $scope.event = {
      title:undefined,
      type:undefined,
      host:undefined,
      location:undefined,
      guestlist:[]
      };

    $scope.foursquarestate = {show:false,name:"Show Foursquare Recommendations",visible:false};
    
    $scope.changestate = function(x){
        
        if (x.show == false){
            x.show = true;
        }else{
             x.show = false;
        }
        
        if (x.show){
            x.name = "Hide Foursquare Recommendations";
        }else{
            x.name = "Show Foursquare Recommendations";
        }
        
        //$scope.apply;
    }

    $scope.foursquarecities = ['Vienna,AT', 'Berlin,DE', 'Amsterdam,NL'];

    $scope.foursquarecity = 'Vienna,AT';

    $scope.usefoursquareloc = function (name,address) {
        $scope.event.location = name + ", " + address;
    }
    
    $scope.rateObject = function(id){
        console.log('id',id);
        // console.log('test12345');
        var obj = {id:id,user:'Wolfgang'};
       restaurant_ref.push(obj); 
    }
    
    $scope.getRating = function (id) {
        restaurant_ref.orderByKey().on("child_added", function (snapshot) {
            console.log(snapshot.key());
        });


        restaurant_ref.orderByValue().on("value", function (snapshot) {
            snapshot.forEach(function (data) {
                console.log("The " + data.key() + " dinosaur's score is " + data.val().id);
            });
        }); 
        
        restaurant_ref.orderByChild("id").equalTo('4dd548a3b0fb7a332e7cc428').on("child_added", function (snapshot) {
            console.log('Test EqualTo',snapshot.key(),'user',snapshot.val().user);
        });
                       
    }
    
    $scope.submitRating = function(img){
        console.log('img',img);        
        console.log('img.id',img.id);
        // console.log('test12345');
        var obj = {id:img.id,user:'Wolfgang',myrating:img.myrating};
       //restaurant_ref.push(obj);              
       restaurant_ref.update(obj);         
    }

      
    var foursquarefcnt = FourSquareService.getvenues;
        
    function getfoursquare(foursquarekeyword,fourquarecity){
        // $scope.foursquarestate.visible = true;
        foursquarefcnt(foursquarekeyword,fourquarecity)
        .then(function (data, status, headers, config) {  
                console.log("data.respons", data.data.response.venues);
                var getphotos = FourSquareService.getphotos;
                var getratings = FourSquareService.getratings;
                return {photos:getphotos(data.data.response.venues),data:data,ratings:getratings(data.data.response.venues)};

            ;}).then(function(data){
                
                $q.all(data.photos)
                    .then(function (responsesArray) {
                          $scope.images = [];

                        for (var i = 0; i < responsesArray.length; i++) {
                           // console.log('responsesArray',responsesArray[i]);
                            var image_url = responsesArray[i].data.response.photos.items[0];
                            // console.log('restaurent',data.data.data.response);
                            var name = data.data.data.response.venues[i].name;
                            var link = data.data.data.response.venues[i].url;
                            var address = data.data.data.response.venues[i].location.address;
                            var id = data.data.data.response.venues[i].id;
                            // console.log('id',id);

                            try {
                                

                                var myrating = undefined;

                                restaurant_ref.orderByChild("id").equalTo(id).on("child_added", function (snapshot) {
                                    myrating = snapshot.val().myrating;
                                    console.log('id', id, myrating);
                                });
                                   
                   var img = { url: image_url.prefix + imgsize + image_url.suffix, name: name, address: address, link: link, id:id,myrating:myrating,rating:'No rating available'};

                                // console.log('img',img);
                                $scope.images.push(img);
                            }
                            catch (err) {
                                console.log(name,err.message);
                            }

                        }

                    //    console.log('ende image loop');
                       $scope.foursquarestate.show = true;
                       $scope.foursquarestate.visible = true;//hide button
                       $scope.apply;                                                                                 
                    });   
                    
                    
                    //datings
                    
                $q.all(data.ratings)
                    .then(function (responsesArray) {
                        for (var i = 0; i < responsesArray.length; i++) {
                            var rating = responsesArray[i].data.response.venue.rating;
                            if (rating != undefined){
                                $scope.images[i].rating = responsesArray[i].data.response.venue.rating;
                            }
                            console.log('image with rating',$scope.images[i]);
                            // console.log('rating?', responsesArray[i].data.response.venue.rating);
                        }
                    });            
                        
            });
    }
    
    $scope.foursquare = getfoursquare;
    
    getfoursquare("sushi","Vienna,AT");
    

    $scope.updatescope = function () {
        $scope.apply;
        $scope.digest;

        for (var i = 0; i < $scope.images.length; i++) {
            console.log('img', i, $scope.images[i]);
        }
    }
    

    $scope.$watch('images', function () {
        //alert('hey, myVar has changed!');   
                               $scope.apply;     
        // for (var i = 0; i < $scope.images.length; i++) {
        //     console.log('img',i,$scope.images[i]);
        //     restaurant_ref.orderByChild("id").equalTo($scope.images[i].id).on("child_added", function (snapshot) {
        //         //console.log('Test EqualTo', snapshot.key(), 'user', snapshot.val().user);
        //         if (snapshot.val().myrating != undefined){
        //             // $scope.images[i].myrating =  snapshot.val().myrating;
        //                              console.log('myrating',snapshot.val().myrating);
        //         }
                

        //          console.log('img',i,$scope.images[i]);

        //     });

        // }
    });



             







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





    
    //Check Date functions
    $scope.checkdateorder = CheckValuesService.checkdateorder;
    
}