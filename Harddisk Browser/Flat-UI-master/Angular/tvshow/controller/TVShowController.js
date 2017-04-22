app.controller("TVShowController", function($scope,$http,$timeout,loadURL) {
    $scope.loading=true;
    $scope.connection='';
    $scope.interval = 2000;
    $scope.onlineUrl="https://codingtj.000webhostapp.com/php/tvshow.php";
    $scope.localUrl="json/tvshow.json";
    $scope.showButton=false;

    $scope.toggleTVShow = function(index) {
        var data = $scope.data;
        var tagName = data[index].tv_show_tag;

        for(var i=0;i<data.length;i++)
        {
            if(i==index)
            {
                continue;
            }
            data[i].show=false;
        }

        var bodyElement = angular.element(document.querySelector('body'));
        if(data[index].show==null || data[index].show==false)
        {
            data[index].show=true;
            bodyElement.attr("class","").addClass(tagName);
        }
        else
        {
            data[index].show=false;  
            bodyElement.attr("class","").addClass("mediaBG");
        }
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

        loadURL($scope.onlineUrl).success(function(response){
            console.log('Accessing online');   
            //First function handles success    
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

    $scope.loadLocalData();
});
