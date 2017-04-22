app.config(function($routeProvider){
    $routeProvider
    .when('/tvshow',{
    	controller: 'TVShowController',
    	templateUrl:'tvshow/view/tvshows.html' 
    })
    .when('/movie',{
    	controller: 'MovieController',
    	templateUrl:'movie/view/movies.html' 
    })
    .otherwise({redirectTo:'/'});
});