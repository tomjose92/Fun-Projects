app.directive('tvshowSeason', function() { 
    return { 
        restrict: 'E', 
        scope: { 
            seasons: '=',
        }, 
        templateUrl: 'tvshow/directives/tvshowSeason.html',
        link : function(scope)
        {
    	   scope.toggleSeason = function(index){
    		
    		    var seasons  = scope.seasons;
    		    for(var i=0;i<seasons.length;i++)
    		    {
    			    if(index==i)
    			    {
    				    continue;
    			    }
    			    seasons[i].show=false;	
    		    }

        	    if(seasons[index].show==null || seasons[index].show==false)
        	    {
                	seasons[index].show=true;
                	scope.selectedIndex = index;
            	}
        	    else
        	    {
        		   seasons[index].show=false;	
        		   scope.selectedIndex = -1;
        	    }
    	    }
        }
    }; 
});