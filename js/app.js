var liveManagerApp = angular.module('liveManagerApp', [
  'ngRoute',
  'bundesligaController',
  'matchController',
  'playerStatsController'
]); 
 
liveManagerApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/bundesliga', {
        templateUrl: 'templates/bundesliga.html',
        controller: 'bundesligaCtrl'
      }).
      when('/match/:homeTeam/vs/:awayTeam/on/:gameTime', {
        templateUrl: 'templates/match.html',
        controller: 'matchCtrl'
      }).
     when('/playerstats/:playerId/on/:gameTime', {
        templateUrl: 'templates/playerstats.html',
        controller: 'playerstatsCtrl'
      }).
     otherwise({
        redirectTo: '/bundesliga'
      })
  }]);
