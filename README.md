Ultimate Manager developer challenge
====================================
At Ultimate Manager we want to challenge the way people consume football by creating an awesome second screen experience(1).

**Objective**: To develop a small statistical dashboard to be used as a second screen.

**Goals**:

1. Visualize how many points each player on the team made in the match.
2. Visualize the points each player made for each minute of the match.

**Extra points**:

All we wan't to see is the above goals being done. But if you want to do some extra work, we would love to see the following (or basically anything you come up with):

1. Combine the interaction of the dashboard/graphs.
2. Proposing future work using github issues/milestones.
2. Good sense of UX.
3. Beautiful visual design.

**Description**:

The data files available are located in this repository. Clone the repo and use it as a base for the project. Feel free to move stuff around. When ready for review, push the repo to your github account and send us the link. The available data is described below.

The challenge shouldn't take much more than around 10 hours.
We will of course only use your work with your permission and you are free to use it for your portfolio.

**Requirements**:

1. Use the data provided in the data directory.
2. Should use Javascript

**Suggestions**:

You are free to visualize the data in any way you like, but here a few suggestions for frameworks that might help you:

1. http://d3js.org/
2. http://www.chartjs.org/
3. http://www.jqplot.com/

**Data:**

First of all, the main premise of our game, is that each football player earn points in realtime in our game, whenever they do some kind of action in real life. Some of the actions could be: "Sucessful pass", "Goal" etc. In this repository, data is provided about a single team (Schalke 04) playing single match in the Bundesliga.

The data is structured as a list of events in the following form (annontated with comments here for clarity):

```json
[
    { "action_name" : "successful_pass",        // The type of action.
        "id" : "9392",                          // A unique id across all events.
        "league" : {
            "name" : "Bundesliga",              // The name of the league
            "season" : "2013/2014",             // The season of the league
        },
        "match" : {
            "away_score" : 3,                   // Number of goals the away team made
            "away_squad" : "Hamburger SV",      // Name of the away team
            "home_score" : 3,                   // Number of goals the home team made
            "home_squad" : "FC Schalke 04",     // Name of the home team
            "played_on" : 1376235000000         // Timestamp of match start (UNIX millisecond)
        },
        "minutes" : 93,                         // Minute in match that the action occured.
        "occurences" : 3,                       // Amount of times this action occured. (See more below).
        "period" : "SecondHalf",                // The period of the match in which the action occured.
        "player_id" : "40236",                  // Unique id of the player.
        "player_name" : "Christian Clemens",    // Name of the player.
        "squad" : "FC Schalke 04",              // Name of the squad.
        "timestamp" : 1376241690000,            // Timestamp of the event (UNIX millisecond)
        "total_points" : 1500                   // Total points awarded for all the occurences of an action. (See more below).
      }
...
]
```

Pay special attention to the "occurences" field. If the occurences field is larger than 1, it means the event is a summarization of multiple similar actions. E.g. the above action is actually 3 sucessfull passes by the same player, each giving 500 points, totalling to 1500 points.

___
*(1) http://en.wikipedia.org/wiki/Second_screen*
