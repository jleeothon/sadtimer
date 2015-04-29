
if (Meteor.isClient) {

  Meteor.startup(function () {
    Session.setDefault("templateName", "about");
  });

  Template.body.events({
    "click h1": function() {
      Session.set("templateName", "about");
    },
    "click h2": function(event, template) {
      var templateName = event.toElement.id;
      Session.set("templateName", templateName);
      template.$("h2 span.active").toggleClass("active");
      template.$("h2 span#" + templateName).addClass("active");
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
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
