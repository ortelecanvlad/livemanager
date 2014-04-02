var liveManagerAppController = angular.module('matchController',[]);
liveManagerAppController.controller('matchCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
	 
   
	 $scope.homeTeam = spaceUnderscore($routeParams.homeTeam);
   $scope.awayTeam = spaceUnderscore($routeParams.awayTeam);
   $scope.gameTime = $routeParams.gameTime;
   $scope.gameDate = getGameDate(parseInt($scope.gameTime));
   $scope.homePlayers = [];
   $scope.awayPlayers = [];
   $scope.homeScore = 0;
   $scope.awayScore = 0;

   $scope.getData = function() {
    dataObject();
  }
  

  $scope.go = function ( hash ) {
    $location.path( hash );
  };

  function underscoreSpace(string) {
    return string.replace(/ /g, "_");
  }

  function spaceUnderscore(string) {
    return string.replace(/_/g, " ");
  }

  $scope.getData();

    var squadDictionary = { "840": "VfB Stuttgart", 
      "839": "SV Werder Bremen", 
      "806": "1899 Hoffenheim",
      "807": "Bayer 04 Leverkusen",
      "841": "VfL Wolfsburg",
      "808": "Borussia Dortmund",
      "833": "FC Bayern München"}

    function dataObject() 
    {
      var actionsFromFile = new Array();

      $.ajax({
        url: "http://127.0.0.1:8000/data/actions.json",
        contentType: "application/json",
        crossDomain: true,
        dataType: "json",
        success: function(data) {
          this.actionsFromFile = data;
        },
        error:function(request, textStatus, errorThrown) {
  
        },
        complete: function () {
            // Handle the complete event

            arrayOfActions = this.actionsFromFile;
            delegatePlayers(arrayOfActions);

          }
      });
    }

    function delegatePlayers(array) {
      for (index = 0; index < array.length; index++) {
              var action = array[index];
              if (action.match.played_on == $scope.gameTime) {
                if (action.match.home_squad == $scope.homeTeam || action.match.away_squad == $scope.awayTeam) {
                  $scope.homeScore = action.match.home_score;
                  $scope.awayScore = action.match.away_score;
                  if (action.squad != undefined) {
                    if (action.squad == $scope.homeTeam) {
                      if ($scope.homePlayers.indexOf(action.player_id) == -1) {
                        $scope.homePlayers.push(action.player_id);
                        
                      }   
                    } else {
                      if ($scope.awayPlayers.indexOf(action.player_id) == -1) {
                        $scope.awayPlayers.push(action.player_id);
                        
                      }
                    }
                  } else if (action.squad_id != undefined) {
                    var homeSquad = "";
                    for (key in squadDictionary) {
                      if (key == action.squad_id) {
                        homeSquad = squadDictionary[key];
                      }
                    }
                    if (homeSquad == $scope.homeTeam) {
                      if ($scope.homePlayers.indexOf(action.player_id) == -1) {
                        $scope.homePlayers.push(action.player_id);
                        
                      }   
                    } else {
                      if ($scope.awayPlayers.indexOf(action.player_id) == -1) {
                        $scope.awayPlayers.push(action.player_id);
                        
                      }
                    }
                  }
                }
              }
            }
            
            $scope.$apply();
    }

    function getGameDate(unixMiliseconds) {
      var date = new Date(unixMiliseconds).toString();
        return date.split("GMT")[0];
    }
	
}]);