counter = function(delta) {
  console.log("delta " + delta);
  return setInterval(function() {
    var s = Session.get("time");
    s += delta;
    if (s < 0) {
      s = 0;
    }
    Session.set("time", s);
  }, 1000);
};


updateTimer = function(step) {
  var s = Session.get("time");
  s += step;
  if (s < 0) {
    s = 0;
  }
  Session.set("time", s);
};

counter2 = new function() {

  this.intervalId = null;

  this.fire = function(step, initial) {
    if (initial === undefined) {
      initial = 0;
    }
    if (this.intervalId) {
      this.quench();
    }
    Session.set("time", initial);
    this.intervalId = setInterval(_.partial(updateTimer, step), 1000);
  };

  this.quench = function() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  };
};
