var liveManagerAppController = angular.module('bundesligaController',[]);
liveManagerAppController.controller('bundesligaCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
  $scope.gamesArr1 = [];
  $scope.gamesArr2 = [];
  var halfArray = 0;

  $scope.getData = function() {
    dataObject();
  }

  function underscoreSpace(string) {
  	return string.replace(/ /g, "_");
  }

  $scope.getData();
  var arrayOfActions = new Array();
  var gamesArray = [];
  var bundesligaGames = [];

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

            for (index = 0; index < arrayOfActions.length; index++) {
              var action = arrayOfActions[index];
              gamesArray.push(action.match);
            }
            
            bundesligaGames = _.uniq(gamesArray, function (item) {
              return 'away_score:' + item.away_score + 'away_squad:' + item.away_squad + 'home_score:' + item.home_score + 'home_squad:' + item.home_score + 'played_on:' + item.played_on;
            });

            halfArray = Math.ceil(bundesligaGames.length/2);

            for (index = 0; index < bundesligaGames.length; index++) {
              var action = bundesligaGames[index];
              for (var key in action) {
                if (key == "home_squad") {
                  action["homeTeam"] = underscoreSpace(action[key]);
                } else if (key == "away_squad") {
                  action["awayTeam"] = underscoreSpace(action[key]);
                } else if (key == "played_on") {
                  action["gameTime"] = action[key];
                  action[key] = getGameDate(action[key]);
                }

                
                
              }
              if (index < halfArray) {

                $scope.gamesArr1.push(action);
              } else {
                $scope.gamesArr2.push(action);
              }
            }

            $scope.$apply();

          }
      });
    }

    function getGameDate(unixMiliseconds) {
      var date = new Date(unixMiliseconds).toString();
        return date.split("GMT")[0];
    }
}]);