/*
 * This counter handles the global time. It can be used both as a stopwatch
 * and countdown timer; fire with positive step (1), or negative step (-1) with
 * initial nonnegative value.
 */

counter2 = new function() {

  var updateTimer;

  updateTimer = function(step) {
    var s = Session.get("time");
    s += step;
    if (s < 0) {
      s = 0;
    }
    Session.set("time", s);
  };

  this.intervalId = null;

  /* Sets an interval timer. Idempotent. */
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

  /* Clears an interval timer. Idempotent. */
  this.quench = function() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    Session.set("time", null);
  };
};
