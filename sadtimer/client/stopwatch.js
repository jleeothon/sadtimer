
Session.setDefault("stopwatchIsRunning", false);
Meteor.subscribe("stopwatches");
Meteor.subscribe("laps");

Template.stopwatchPanel.helpers({
  "stopwatchIsRunning": function() {
    return Session.get("stopwatchIsRunning");
  },
  "stopwatches": function() {
    return Stopwatches.find({}, {sort: {createdAt: -1}});
  }
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
