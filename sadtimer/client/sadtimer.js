/*
 * - Makes the titles change modes (about-countdown-stopwatch).
 * - Configures the user login.
 * - Controls keyboard events.
 */

stopwatchKeyEvents = {
  113: function() {document.querySelector("#start").click();}, // q
  119: function() {document.querySelector("#lap").click();}, // w
  101: function() {document.querySelector("#reset").click();} // e
};

countdownKeyEvents = {
  13: function() {document.querySelector("#go").click();} // enter
};

signInRequired = {
  "aboutPanel": false,
  "countdownPanel": true,
  "stopwatchPanel": true
};

Session.setDefault("templateName", "aboutPanel");

Template.body.rendered = function() {
  var f;
  var templateName;
  document.querySelector("body").addEventListener("keypress", function(event) {
    templateName = Session.get("templateName");
    if (templateName === "stopwatchPanel") {
      f = stopwatchKeyEvents[event.which];
    } else if (templateName === "countdownPanel") {
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
    template.$("h2.active").toggleClass("active");
    template.$("h2[data-templatename=" + templateName + "]").addClass("active");
    Session.set("signInRequired", signInRequired[templateName]);
    clearCountdown();
    clearStopwatch();
  }
});

Template.body.helpers({
  templateName: function() {
    return Session.get("templateName");
  },
  signInRequired: function() {
    return Session.get("signInRequired");
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

