Template.clock.helpers({
  "hours": function() {
    var time = Session.get("time") || 0;
    time = Math.floor(time / 3600);
    return time ? padNumber(time, 3) : "000";
  },
  "minutes": function() {
    var time = Session.get("time") || 0;
    time = Math.floor(time / 60) % 60;
    return time ? padNumber(time, 2) : "00";
  },
  "seconds": function() {
    var time = Session.get("time") || 0;
    time = time % 60;
    return time ? padNumber(time, 2) : "00";
  }
});
