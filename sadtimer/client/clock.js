
clockHandHelperFactory = function(divisor, modulus, padding) {
  return function() {
    var time;
    var result;
    time = Session.get("time") || 0;
    time = Math.floor(time / divisor);
    if (modulus) {
      time = time % modulus;
    }
    result = padNumber(time, padding);
    return result;
  };
};

Template.clock.helpers({
  "hours": clockHandHelperFactory(3600, null, 3),
  "minutes": clockHandHelperFactory(60, 60, 2),
  "seconds": clockHandHelperFactory(1, 60, 2)
});
