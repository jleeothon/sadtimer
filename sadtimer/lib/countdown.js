Countdowns = new Mongo.Collection("countdowns");

clearCountdown = function() {
  var countdownId;
  counter2.quench();
  Session.set("time", null);
  countdownId = Session.get("countdownId");
  if (countdownId) {
    Meteor.call("finishCountdown", countdownId);
  }
};
