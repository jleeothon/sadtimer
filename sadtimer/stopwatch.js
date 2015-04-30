Stopwatches = new Mongo.Collection("stopwatches");
Laps = new Mongo.Collection("laps");

padNumber = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

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
    Session.set("stopwatchRunning", true);
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
    Session.set("stopwatchRunning", false);
    Session.set("stopwatchId", null);
    clearInterval(Session.get("stopwatchHoursIntervalID"));
    clearInterval(Session.get("stopwatchMinutesIntervalID"));
    clearInterval(Session.get("stopwatchSecondsIntervalID"));
    template.$(".clock span").text("00");
  }
}

if (Meteor.isClient) {

  Session.setDefault("stopwatchRunning", false);
  Meteor.subscribe("stopwatches");
  Meteor.subscribe("laps");

  Template.stopwatch.helpers({
    "stopwatchRunning": function() {
      return Session.get("stopwatchRunning");
    },
    "stopwatches": function() {
      return Stopwatches.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.stopwatch.events({
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

  Template.stopwatchInstance.helpers({
    unfinished: function() {
      return !this.finished;
    },
    laps: function() {
      return Laps.find({stopwatchId: this._id}, {sort: {createdAt: 1}});
    }
  });

  Template.stopwatchInstance.events({
    "click button": function(event) {
      Meteor.call("deleteStopwatch", this._id);
    }
  });

}

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
