stopwatchKeyEvents = {
  113: function() {document.querySelector("#start").click();}, // q
  119: function() {document.querySelector("#lap").click();}, // w
  101: function() {document.querySelector("#reset").click();} // e
};

countdownKeyEvents = {
  13: function() {document.querySelector("#go").click();} // enter
};

Meteor.startup(function () {
  Session.setDefault("templateName", "aboutPanel");
});

Template.body.rendered = function() {
  var templateName = Session.get("templateName");
  var f;
  document.querySelector("body").addEventListener("keypress", function(event) {
    if (templateName == "stopwatchPanel") {
      f = stopwatchKeyEvents[event.which];
    } else if (templateName == "countdownPanel") {
      f = countdownKeyEvents[event.which];
    }
    if (f) {
      f();
    }
  });
}

Template.body.events({
  "click h1": function() {
    Session.set("templateName", "aboutPanel");
  },
  "click h2": function(event, template) {
    var templateName = $(event.toElement).data("templatename");
    Session.set("templateName", templateName);
    template.$("h2 span.active").toggleClass("active");
    template.$("h2 span[data-templatename=" + templateName + "]").addClass("active");
    clearCountdown();
    clearStopwatch();
  }
});

Template.body.helpers({
  templateName: function(){
    return Session.get("templateName");
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

