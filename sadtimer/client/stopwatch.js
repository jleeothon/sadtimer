
Session.setDefault("stopwatchIsRunning", false);
Meteor.subscribe("stopwatches");
Meteor.subscribe("laps");

StopwatchHandler = {
  start: function() {
    var stopwatchId = Session.get("stopwatchId");
    if (stopwatchId) {
      StopwatchHandler.reset();
    }
    Session.set("stopwatchIsRunning", true);
    counter2.fire(1);
    console.log("hey");
    Meteor.call("startStopwatch", function(error, result) {
      if (error === undefined) {
        Session.set("stopwatchId", result);
      }
    });
  },
  lap: function() {
    var stopwatchId = Session.get("stopwatchId");
    if (stopwatchId) {
      Meteor.call("recordLap", stopwatchId);
    }
  },
  reset: function() {
    clearStopwatch();
  }
};

Template.stopwatchPanel.helpers({
  "stopwatchIsRunning": function() {
    return Session.get("stopwatchIsRunning");
  },
  "stopwatches": function() {
    return Stopwatches.find({}, {sort: {createdAt: -1}});
  },
  "signInRequired": true
});

Template.stopwatchControls.events({
  "click #start": function(event, template) {
    StopwatchHandler.start();
  },
  "click #lap": function(event, template) {
    StopwatchHandler.lap();
  },
  "click #reset": function(event, template) {
    StopwatchHandler.reset();
  }
});

Template.stopwatch.helpers({
  unfinished: function() {
    return !this.finished;
  },
  laps: function() {
    return Laps.find({stopwatchId: this._id}, {sort: {createdAt: 1}});
  }
});

Template.stopwatch.events({
  "click button": function(event) {
    Meteor.call("deleteStopwatch", this._id);
  }
});
