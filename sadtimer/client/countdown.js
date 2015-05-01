
function parseInputs(template) {
  var hoursInput, minutesInput, secondsInput;
  var hours, minutes, seconds;
  hoursInput = template.$("#hours")[0];
  minutesInput = template.$("#minutes")[0];
  secondsInput = template.$("#seconds")[0];
  hours = parseInt(hoursInput.value, 10) || 0;
  minutes = parseInt(minutesInput.value, 10) || 0;
  seconds = parseInt(secondsInput.value, 10) || 0;
  return {hours: hours, minutes: minutes, seconds: seconds};
}

function clearInputs(template) {
  template.$("input[type=number]").val(0);
}

Meteor.subscribe("countdowns");

Template.countdownPanel.helpers({
  "countdowns": function() {
    return Countdowns.find({}, {sort: {createdAt: -1}});
  }
});

Template.countdownControls.events({
  "submit": function(events, template) {
    var totalTime, val;
    val = parseInputs(template);
    clearInputs(template);
    totalTime = toSeconds(val["hours"], val["minutes"], val["seconds"]);
    Session.set("time", totalTime);
    Meteor.call("createCountdown", function(error, result) {
      if (!error) {
        Session.set("countdownId", result);
      }
    });
    counter2.fire(-1, totalTime);
    setTimeout(clearCountdown, totalTime * 1000);
    return false;
  }
});

Template.countdown.helpers({
  status: function() {
    if (this.finished) {
      return "finished";
    } else {
      return "not finished";
    }
  },
  startDateTime: function() {
    var s = new Date(this.createdAt).toLocaleString("en-gb");
    return s;
  }
});

Template.countdown.events({
  "click button": function() {
    Meteor.call("deleteCountdown", this._id);
  }
});
