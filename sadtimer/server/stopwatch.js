
Meteor.methods({
  startStopwatch: function() {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    return Stopwatches.insert({
      ownerId: Meteor.userId(),
      username: Meteor.user().username,
      createdAt: new Date()
    });
  },
  recordLap: function(stopwatchId) {
    Laps.insert({
      ownerId: Meteor.userId(),
      stopwatchId: stopwatchId,
      createdAt: new Date()
    });
  },
  deleteStopwatch: function(stopwatchId) {
    Stopwatches.remove(stopwatchId);
    Laps.remove({stopwatchId: stopwatchId});
  }
});

if (Meteor.isServer) {
  Meteor.publish("stopwatches", function() {
    return Stopwatches.find({ownerId: this.userId});
  });
  Meteor.publish("laps", function() {
    return Laps.find({ownerId: this.userId});
  });
}
