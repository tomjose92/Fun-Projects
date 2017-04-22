var app = angular.module('myApp',['ngRoute'])         

app.controller("MediaController", function($scope,$location) {
	$scope.background = "mediaBG";
	$scope.checkURL = function()
	{
		var url = $location.absUrl();
		var bodyElement = angular.element(document.querySelector('body'));
		if(url.indexOf("movie")>=0)
		{
			bodyElement.attr("class","").addClass("movieBG");
		}
		else
		{
			bodyElement.attr("class","").addClass("mediaBG");
		}

		if(url.indexOf("tvshow")>=0 || url.indexOf("movie")>=0)
		{
			$scope.hide=true;
		}
		else
		{
			$scope.hide=false;	
		}
	}

	$scope.$on('$routeChangeSuccess', function(next, current) { 
   		$scope.checkURL();
 	});

	$scope.checkURL();
});
