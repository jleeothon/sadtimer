function clearCountdown() {
  clearInterval(Session.get("secondsIntervalID"));
  Session.set("secondsIntervalID", null);
  Session.set("time", null);
  Meteor.call("finishCountdown", Session.get("countdownId"));
};

Meteor.subscribe("countdowns");

Template.countdownPanel.helpers({
  "countdowns": function() {
    return Countdowns.find({}, {sort: {createdAt: -1}});
  }
});

Template.countdownControls.events({
  "click #go": function(event, template) {
    var time, hours, minutes, seconds;
    var hoursInput, minutesInput, secondsInput;
    var secondsIntervalID;
    hoursInput = template.$("#hours")[0];
    minutesInput = template.$("#minutes")[0];
    secondsInput = template.$("#seconds")[0];
    hours = parseInt(hoursInput.value, 10) || 0;
    minutes = parseInt(minutesInput.value, 10) || 0;
    seconds = parseInt(secondsInput.value, 10) || 0;
    hoursInput.value = 0;
    minutesInput.value = 0;
    secondsInput.value = 0;
    time = toSeconds(hours, minutes, seconds);
    Session.set("time", time);
    Meteor.call("createCountdown", function(error, result) {
      if (!error) {
        Session.set("countdownId", result);
      }
    });
    secondsIntervalID = counter(-1);
    Session.set("secondsIntervalID", secondsIntervalID);
    setTimeout(function() {
      clearCountdown();
    }, time * 1000);
  }
});

Template.countdown.helpers({
  "status": function() {
    if (this.finished) {
      return "finished";
    } else {
      return "not finished";
    }
  }
});

Template.countdown.events({
  "click button": function() {
    Meteor.call("deleteCountdown", this._id);
  }
});
