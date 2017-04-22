
app.controller("MovieController", function($scope,$http,$timeout,loadURL,$window) {
    $scope.onlineUrl="https://codingtj.000webhostapp.com/php/movie.php";
    $scope.localUrl="json/movie.json";

    $scope.loading=true;
    $scope.connection='';
    $scope.interval = 2000;

    loadLetters = function(){
        var letterArray = [];
        for (var idx='A'.charCodeAt(0),end='Z'.charCodeAt(0); idx <=end; ++idx){
            letterArray.push(String.fromCharCode(idx));
        }
        $scope.letterArray=letterArray;
    },

    $scope.clickLetter = function(event)
    {   
        var letter =event.target.text; 
        var letterElement = angular.element(document.querySelector('[name="'+letter+'"]'));
        var height = letterElement.prop('offsetTop');
        $window.scrollTo(0, height);
    },
    
    $scope.loadLocalData = function()
    {
        $scope.interval = 2000;
        loadURL($scope.localUrl).success(function(response){
            console.log('Accessing local');   
            $timeout(function () {
                $scope.connection='local';
                $scope.data = response.records;
                $scope.showButton = true;
                $scope.loading = false;
                $scope.ínterval=0;
                $scope.loadOnlineData();
            },$scope.interval);
        }).error(function(){
            $scope.loadOnlineData();
        });
    },
    
    $scope.loadOnlineData = function(value){
        if(value)
        {
            $scope.loading = true;
        }

        loadURL($scope.onlineUrl,$scope.data).success(function(response){
            console.log('Accessing online');   
            $scope.content=null;
            $timeout(function () {
                $scope.connection='online';
                $scope.data = response.records;
                $scope.loading = false;
            },$scope.interval);
        }).error(function(){
            if(!value)
            {
                $scope.content = "Unable to connect to database. Please try again or check your connection";
            }
            else
            {
                $scope.connection='local';
            }
        });
    }

    loadLetters(); 
    $scope.loadLocalData();
    
});