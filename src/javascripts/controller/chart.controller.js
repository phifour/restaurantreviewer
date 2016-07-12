app.controller('ChartCtrl', ['$scope',ChartCtrl]);

function ChartCtrl($scope) {
		
	$scope.barchartdata = [{"date":new Date("October 13, 2014 11:13:00"),"value":54},{"date":new Date("October 14, 2014 11:13:00"),"value":200}];

	$scope.ticks = 10;
	$scope.state = 1;
	$scope.scale = 1;
	
    $scope.selfunction = Math.sin;
    
		$scope.add = function() {	
		$scope.barchartdata.push({"date":new Date("October 16, 2015 11:13:00"),"value":354});
		};		
	
		$scope.doticks = function() {	
			$scope.ticks = $scope.ticks + 10;
		};			
		
		
		$scope.changescale = function() {	
			$scope.scale = $scope.scale*-1;
		};	
	   
        $scope.changefunction = function() {	
			$scope.myfunction = Math.abs;
		};	

			
};