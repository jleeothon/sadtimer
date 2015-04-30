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
  template.$("input").val(0);
}

Meteor.subscribe("countdowns");

Template.countdownPanel.helpers({
  "countdowns": function() {
    return Countdowns.find({}, {sort: {createdAt: -1}});
  }
});

Template.countdownControls.events({
  "click #go": function(event, template) {
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
    setTimeout(clearCountdown, time * 1000);
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
