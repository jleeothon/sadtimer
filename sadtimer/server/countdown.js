Meteor.methods({
  "createCountdown": function() {
    return Countdowns.insert({
      ownerId: Meteor.userId(),
      createdAt: new Date()
    });
  },
  "finishCountdown": function(id) {
    Countdowns.update(id, {$set: {"finished": new Date()}});
  },
  "deleteCountdown": function(id) {
    Countdowns.remove(id);
  }
});

Meteor.publish("countdowns", function() {
  return Countdowns.find({ownerId: this.userId});
});
