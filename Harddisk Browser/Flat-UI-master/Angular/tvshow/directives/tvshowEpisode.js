app.directive('tvshowEpisode', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      episodes: '=' 
    }, 
    templateUrl: 'tvshow/directives/tvshowEpisode.html',
    link : function(scope)
    {
    	if(scope.episodes.length==0)
    	{
    		scope.showEpisodes=true;
    	}
    },
  }; 
});