padNumber = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

Countdowns = new Mongo.Collection("countdowns");

clearCountdown = function() {
  clearInterval(Session.get("secondsIntervalID"));
  Session.set("secondsIntervalID", null);
  Meteor.call("finishCountdown", Session.get("countdownId"));
};

toSeconds = function(hours, minutes, seconds) {
  return hours * 60 * 60 + minutes * 60 + seconds;
}

if (Meteor.isClient) {

  Meteor.subscribe("countdowns");

  Template.controls.events({
    "click #go": function(event, template) {
      var time, hours, minutes, seconds;
      var secondsIntervalID;
      hours = parseInt(template.$("#hours")[0].value, 10) || 0;
      minutes = parseInt(template.$("#minutes")[0].value, 10) || 0;
      seconds = parseInt(template.$("#seconds")[0].value, 10) || 0;
      time = toSeconds(hours, minutes, seconds);
      Session.set("time", time);
      Meteor.call("createCountdown", function(error, result) {
        if (!error) {
          Session.set("countdownId", result);
        }
        console.log("hey");
      });
      console.log("hey");
      secondsIntervalID = setInterval(function() {
        var s = Session.get("time");
        Session.set("time", s > 0 ? s - 1 : 0);
        console.log(s);
      }, 1000);
      Session.set("secondsIntervalID", secondsIntervalID);
      setTimeout(function() {
        clearCountdown();
      }, time * 1000);
    }
  });

  Template.countdown.helpers({
    "countdowns": function() {
      return Countdowns.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.clock.helpers({
    "hours": function() {
      var time = Session.get("time");
      time = Math.floor(time / 3600);
      return time ? padNumber(time, 3) : "000";
    },
    "minutes": function() {
      var time = Session.get("time");
      time = Math.floor(time / 60) % 60;
      return time ? padNumber(time, 2) : "00";
    },
    "seconds": function() {
      var time = Session.get("time");
      time = time % 60;
      return time ? padNumber(time, 2) : "00";
    }
  })

  Template.countdownInstance.helpers({
    "status": function() {
      if (this.finished) {
        return "finished";
      } else {
        return "not finished";
      }
    }
  });

  Template.countdownInstance.events({
    "click button": function() {
      Meteor.call("deleteCountdown", this._id);
    }
  });
}


Meteor.methods({
  "createCountdown": function() {
    return Countdowns.insert({
      ownerId: Meteor.userId(),
      createdAt: new Date()
    });
  },
  "finishCountdown": function(id) {
    Countdowns.update(id, {$set: {"finished": true}});
  },
  "deleteCountdown": function(id) {
    Countdowns.remove(id);
  }
});

if (Meteor.isServer) {
  Meteor.publish("countdowns", function() {
    return Countdowns.find({ownerId: this.userId});
  });
}
