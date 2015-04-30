Stopwatches = new Mongo.Collection("stopwatches");
Laps = new Mongo.Collection("laps");

clearStopwatch = function() {

};

StopwatchHandler = {
  start: function() {
    var stopwatchSecondsIntervalID;
    Session.set("stopwatchIsRunning", true);
    Session.set("time", 0);
    stopwatchSecondsIntervalID = counter(1);
    console.log("hey");
    Meteor.call("startStopwatch", function(error, result) {
      if (error === undefined) {
        Session.set("stopwatchId", result);
      }
    });
    Session.set("stopwatchSecondsIntervalID", stopwatchSecondsIntervalID);
  },
  lap: function() {
    var stopwatchId = Session.get("stopwatchId");
    if (stopwatchId) {
      Meteor.call("recordLap", stopwatchId);
    }
  },
  reset: function() {
    Session.set("stopwatchIsRunning", false);
    Session.set("stopwatchId", null);
    clearInterval(Session.get("stopwatchSecondsIntervalID"));
    Session.set("time", 0);
  }
};
