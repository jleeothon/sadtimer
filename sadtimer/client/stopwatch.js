
Session.setDefault("stopwatchIsRunning", false);
Meteor.subscribe("stopwatches");
Meteor.subscribe("laps");


function Timer(seconds, padding, element) {
  var t = this;
  this.current = 0;
  this.element = element;
  this.id = setInterval(function() {
    t.element.text(padNumber(t.current, padding));
    t.current++;
  }, seconds * 1000);
}

TimerFactory = function(template) {
  this.template = template;
}

TimerFactory.prototype.secondTimer = function() {
  var element = this.template.$(".clock .seconds");
  return new Timer(1, 2, element)
}

TimerFactory.prototype.minuteTimer = function() {
  var element = this.template.$(".clock .minutes");
  return new Timer(60, 2, element);
}

TimerFactory.prototype.hourTimer = function() {
  var element = this.template.$(".clock .hours");
  return new Timer(60 * 60, 3, element);
}

StopwatchHandler = {
  start: function(template) {
    var tFactory, hours, minutes, seconds;
    Session.set("stopwatchIsRunning", true);
    tFactory = new TimerFactory(template);
    hours = tFactory.hourTimer();
    minutes = tFactory.minuteTimer();
    seconds = tFactory.secondTimer();
    Meteor.call("startStopwatch", function(error, result) {
      if (error === undefined) {
        Session.set("stopwatchId", result);
      }
    });
    Session.set("stopwatchHoursIntervalID", hours.id);
    Session.set("stopwatchMinutesIntervalID", minutes.id);
    Session.set("stopwatchSecondsIntervalID", seconds.id);
  },
  lap: function(template) {
    var stopwatchId = Session.get("stopwatchId");
    if (stopwatchId) {
      Meteor.call("recordLap", stopwatchId);
    }
  },
  reset: function(template) {
    Session.set("stopwatchIsRunning", false);
    Session.set("stopwatchId", null);
    clearInterval(Session.get("stopwatchHoursIntervalID"));
    clearInterval(Session.get("stopwatchMinutesIntervalID"));
    clearInterval(Session.get("stopwatchSecondsIntervalID"));
    template.$(".clock span").text("00");
  }
}



Template.stopwatchControls.helpers({
  "stopwatchIsRunning": function() {
    return Session.get("stopwatchIsRunning");
  },
  "stopwatches": function() {
    return Stopwatches.find({}, {sort: {createdAt: -1}});
  }
});

Template.stopwatchControls.events({
  "click #start": function(event, template) {
    StopwatchHandler.start(template);
  },
  "click #lap": function(event, template) {
    StopwatchHandler.lap(template);
  },
  "click #reset": function(event, template) {
    StopwatchHandler.reset(template);
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
