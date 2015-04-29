
if (Meteor.isClient) {

  Template.countdown.events({
    "submit .countdown": function(event) {
      event.preventDefault();
      console.log(" hey ");
      return false;
    },
    "hover input": function(event) {
      console.log("hey");
    },
    "click p": function() {
      console.log("lolo");  
    }
  });

  Template.countdown.helpers({
    
  });
}
