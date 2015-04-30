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
