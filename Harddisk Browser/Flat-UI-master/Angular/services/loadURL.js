app.factory('loadURL', function($http) {
	return loadData = function(url,data){
	  	return $http({
    		url: url, 
    		method: "GET",
    		data: data
 		})
    	.success(function(data) { 
    		console.log(data);
    		return data; 
    	}) 
    	.error(function(err) { 
    		return err; 	
    	});
    }
});
