
Session.setDefault("stopwatchIsRunning", false);
Meteor.subscribe("stopwatches");
Meteor.subscribe("laps");

StopwatchHandler = {
  start: function() {
    var sfx;
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
    sfx = new Audio("/sfx/glass-ping.mp3");
    sfx.play();
  },
  lap: function() {
    var sfx;
    var stopwatchId = Session.get("stopwatchId");
    if (stopwatchId) {
      Meteor.call("recordLap", stopwatchId);
    }
    sfx = new Audio("/sfx/glass-ping.mp3");
    sfx.play();
  },
  reset: function() {
    var sfx;
    clearStopwatch();
    sfx = new Audio("/sfx/glass-ping.mp3");
    sfx.play();
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
  startDate: function() {
    return (new Date(this.createdAt).toLocaleDateString("en-gb"));
  },
  startTime: function() {
    return (new Date(this.createdAt).toLocaleTimeString("en-gb"));
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

Template.lap.helpers({
  duration: function() {
    return Math.round(this.duration / 1000);
  }
});
