Stopwatches = new Mongo.Collection("stopwatches");
Laps = new Mongo.Collection("laps");

clearStopwatch = function() {
  Session.set("stopwatchIsRunning", false);
  Session.set("stopwatchId", null);
  counter2.quench();
};
