var liveManagerAppController = angular.module('playerStatsController',[]);
liveManagerAppController.controller('playerstatsCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {


	$scope.totalPoints = 0;
  $scope.interestPlayerId = $routeParams.playerId;
  $scope.nameOfPlayer = "";
  $scope.homeTeam = "";
  $scope.awayTeam = "";
  $scope.gameTime = parseInt($routeParams.gameTime);
  $scope.gameDate = "";
  $scope.homeScore = 0;
  $scope.awayScore = 0;
  $scope.legend = [];
  $scope.negatives = [];
  $scope.noSHowNegatives = false;

  

  $scope.updateData = function() {  

     dataObject();
  }

  $scope.updateData();

  var gameTime;
   
  var totalPlayerPoints = 0;

  var arrayOfActions = new Array();
  var maximumMinute = 0;

  var pieChartData = [];
  var pieChartLegend =[];
  var pieChartNegativePoints = [];

  var lineChartData = {};

  var lineChartFillColor = "rgba(151,187,205,.9)";
  var lineChartStrokeColor = "rgba(15,32,128,1)";
  var lineChartPointColor = "rgba(15,32,128,1)";
  var lineChartPointStrokeColor = "rgba(255,255,255,1)";

  var colorArray1 = ["#A1590D", "#4B5769", "#99FF00", "#028482", "#FFCC99", "#663399", "#8C001A", "#CCFFFF", "#FFFFCC", "#FF6600", "#336699", "#FF0000", "#666666", "#FFCC00", "#003366"];
  var colorArray = ["#41c1dc", "#41dcab", "#a7dc41", "#237f80", "#dcb641", "#dc7841", "#dc4141", "#8246d3", "#897bf5", "#ed3b97", "#902561", "#286cd3", "#adebff", "#fce566", "#454545"];


  function drawCharts() 
  {
    var options = {scaleGridLineColor : "rgba(255,255,255,1)", scaleGridLineWidth : .5, scaleFontColor : "rgba(255,255,255,1)", pointDotStrokeWidth: 2, scaleFontSize: 10 }
    var ctx = document.getElementById("playerLineChart").getContext("2d");
    var myPlayerLineChart = new Chart(ctx).Line(lineChartData, options);

    var pieOptions = {segmentStrokeColor: "#D0DADB"}
    var ctx = document.getElementById("playerPieChart").getContext("2d");
    var myPlayerPieChart = new Chart(ctx).Pie(pieChartData, pieOptions);
  }

  function suffleArray(array) 
  {
    var m = array.length, t, i;

     // While there remain elements to shuffle…
     while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  function dataObject() 
  {
    var actionsFromFile = new Array();
    var totalPoints = 0;

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

          $scope.totalPoints  = getTotalNumberOfPointsPerGame($scope.interestPlayerId, $scope.gameTime);
          getNumberOfPointsPerMinute($scope.interestPlayerId, $scope.gameTime);
          drawCharts();

          $scope.legend = getPieChartLegend();
          $scope.negatives = getPieChartNegatives();

          if ($scope.negatives.length == 0) {
            $scope.noSHowNegatives = true;
          }

          var date = new Date($scope.gameTime).toString();
          $scope.gameDate = date.split("GMT")[0];

          $scope.$apply();

          return totalPoints;

        }
    });
  }

  function replaceUnderscore(string) {
    var replaced = string.replace(/_/g, " ");

    return replaced.charAt(0).toUpperCase() + replaced.slice(1);
  }

  function getPieChartLegend() {
    for (var i in pieChartLegend) {
      pieChartLegend[i].action = replaceUnderscore(pieChartLegend[i].action);
    }
    return pieChartLegend;
  }

  function getPieChartNegatives() {
    for (var i in pieChartNegativePoints) {
      pieChartNegativePoints[i].action = replaceUnderscore(pieChartNegativePoints[i].action);
    }
    return pieChartNegativePoints;
  }

  function getTotalNumberOfPointsPerGame(playerId, gameTimestamp)
  {

    var totalPlusPoints = 0;
    var totalMinusPoints = 0;
    var actionDictionary = {};

    var suffledArray = suffleArray(colorArray);

    // here we start finding out the number of points
    // a player made in a game
    // and how the points are organised on individual actions

    for (index = 0; index < arrayOfActions.length; index++) {
      var action = arrayOfActions[index];
        
        // if the game went on for more that 90 minutes
        // then update the number of minutes the game had
      if (action.minutes > maximumMinute ) {
        maximumMinute = action.minute;
      }

      if (action.match.played_on == gameTimestamp) {
        if (action.player_id == playerId) {
          
          $scope.nameOfPlayer = action.player_name;
          $scope.homeTeam = action.match.home_squad;
          $scope.awayTeam = action.match.away_squad;
          $scope.homeScore = action.match.home_score;
          $scope.awayScore = action.match.away_score;
          $scope.$apply();

          playerName = action.player_name;

          if (action.total_points > 0) {
            totalPlusPoints += action.total_points;
          }
          else {
            totalMinusPoints += action.total_points;
          }

          if (actionDictionary[action.action_name] != undefined) {
         
            actionDictionary[action.action_name] += action.total_points;
      
          } 
          else {
            actionDictionary[action.action_name] = action.total_points;
          } 
        }
      }
    }

    var suffledIndex = 0;
    for (key in actionDictionary) {

      if(actionDictionary[key] > 0) {
        pieChartData.push({"value" : actionDictionary[key], "color" : suffledArray[suffledIndex]});
        pieChartLegend.push({"value" : actionDictionary[key], "color" : suffledArray[suffledIndex], "action" : key});
      } else {
        pieChartNegativePoints.push({"action" : key, "value" : actionDictionary[key]});
      }

      suffledIndex += 1;
    }

    actionDictionary["totalPlusPoints"] = totalPlusPoints;
    actionDictionary["totalMinusPoints"] = totalMinusPoints;
    actionDictionary["totalPoints"] = totalPlusPoints + totalMinusPoints;

    totalPoints = actionDictionary["totalPoints"];

    return actionDictionary["totalPoints"];
  }

  function getNumberOfPointsPerMinute(playerId, gameTimestamp) 
  {
    var pointsPerMinuteDict = {};
    var endGameMinute = 90;

    if (maximumMinute > endGameMinute) {
      endGameMinute = maximumMinute;
    }
      
      for (index = 0; index < arrayOfActions.length; index++) {
      var action = arrayOfActions[index];

      if (action.match.played_on == gameTimestamp) {
        if (action.player_id == playerId) {

          if (pointsPerMinuteDict[action.minutes] != undefined && pointsPerMinuteDict[action.minutes] != 0) {
           
            pointsPerMinuteDict[action.minutes] += action.total_points;
          
          } 
          else {
            pointsPerMinuteDict[action.minutes] = action.total_points;
          } 
        }
      }
    }

    for (i = 0; i < endGameMinute + 1; i++) {

      if (pointsPerMinuteDict[i] == undefined || pointsPerMinuteDict[i] == undefined) {
        pointsPerMinuteDict[i] = 0;
      }
    }

    var xAxisLabels = [];
    var lineData = [];
    for (key in pointsPerMinuteDict) {
      xAxisLabels.push(key);
      lineData.push(pointsPerMinuteDict[key]);
    }

    lineChartData = {"labels" : xAxisLabels , "datasets" : [{"fillColor" : lineChartFillColor, "strokeColor" : lineChartStrokeColor, "pointColor" : lineChartPointColor, "pointStrokeColor" : lineChartPointStrokeColor, "data" : lineData}]}
      
      return pointsPerMinuteDict;

  }
}]);