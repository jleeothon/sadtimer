Stopwatches = new Mongo.Collection("stopwatches");
Laps = new Mongo.Collection("laps");

padNumber = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function Timer(milliseconds, element) {
  var t = this;
  this.current = 0;
  this.element = element;
  this.id = setInterval(function() {
    console.log(t.current);
    t.current++;
  }, milliseconds);
  this.stop = function() {
    clearInterval(this.id);
  };
}

StopwatchHandler = {
  start: function(template) {
    Session.set("stopwatchRunning", true);
    console.log(template.$(".clock.seconds"));
    Meteor.call("startStopwatch", function(error, result) {
      if (error === undefined) {
        Session.set("stopwatchId", result);
      }
    });
  },
  lap: function(template) {
    var stopwatchId = Session.get("stopwatchId");
    if (stopwatchId) {
      console.log(stopwatchId);
      Meteor.call("recordLap", stopwatchId);
    } else {
      console.log("no id");
    }
  },
  reset: function(template) {
    Session.set("stopwatchRunning", false);
    Session.set("stopwatchId", null);
  }
}

if (Meteor.isClient) {

  Session.setDefault("stopwatchRunning", false);
  Meteor.subscribe("stopwatches");
  Meteor.subscribe("laps");

  Template.body.rendered = function() {
    document.querySelector('body').addEventListener("keypress", function(event) {
      if (Session.get("templateName") == "stopwatch") {
        if (event.which == 113 /* q */) {
          document.querySelector("#start").click();
        } else if (event.which == 119 /* w */) {
          document.querySelector("#lap").click();
        } else if (event.which == 101 /* e */) {
          document.querySelector("#reset").click();
        }
      }
    });
  }

  Template.stopwatch.helpers({
    "stopwatchRunning": function() {
      return Session.get("stopwatchRunning");
    },
    "stopwatches": function() {
      return Stopwatches.find();
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
      return Laps.find({stopwatchId: this._id});
    }
  });
}

Meteor.methods({
  startStopwatch: function() {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    console.log("creating stopwatch");
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
  updateStopwatch: function() {
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
