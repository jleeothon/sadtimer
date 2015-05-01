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

signInRequired = {
  "aboutPanel": false,
  "countdownPanel": true,
  "stopwatchPanel": true
};

function changePanel(templateName) {
  Session.set("templateName", templateName);
  $("h2.active").removeClass("active");
  $("h2[data-templatename=" + templateName + "]").addClass("active");
  Session.set("signInRequired", signInRequired[templateName]);
  clearCountdown();
  clearStopwatch();
}

Template.body.rendered = function() {
  var f;
  var templateName;
  document.querySelector("body").addEventListener("keypress", function(event) {
    templateName = Session.get("templateName");
    if (templateName === "stopwatchPanel") {
      f = stopwatchKeyEvents[event.which];
    }
    if (f) {
      f();
    }
  });
}

Template.body.events({
  "click h1 a": function() {
    changePanel("aboutPanel");
  },
  "click h2 a": function(event, template) {
    var templateName = $(event.toElement).parent().data("templatename");
    changePanel(templateName);
  }
});

Template.body.helpers({
  templateName: function() {
    return Session.get("templateName") || "aboutPanel";
  },
  signInRequired: function() {
    return Session.get("signInRequired");
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

