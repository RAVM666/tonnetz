var keyboard = (function() {
  "use strict";

  var module = {};

  var map = {};

  var keys = [
    [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187],
    [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221],
    [65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222],
    [90, 88, 67, 86, 66, 78, 77, 188, 190, 191]
  ];

  for (let i = 0; i < keys.length; i++) {
    let row = keys[i];

    for (let j = 0; j < row.length; j++) {
      let key = row[j];

      map[key] = (4 * i + 7 * j) % 12;
    }
  }

  var base = 61;

  module.init = function() {
    $(window).keydown(onKeyDown);
    $(window).keyup(onKeyUp);
  };

  var getPitchFromKeyboardEvent = function(event) {
    var note = base + map[event.which];

    if (isFinite(note) && !event.ctrlKey && !event.altKey && !event.metaKey)
      return note;
    else
      return null;
  };

  var onKeyDown = function(event) {
    var key = event.key;
    if ("Shift" == key)
      tonnetz.sustainOn(16);
    else if ("ArrowDown" == key)
      base += 4;
    else if ("ArrowUp" == key)
      base -= 4;
    else if ("ArrowRight" == key)
      base += 7;
    else if ("ArrowLeft" == key)
      base -= 7;

    var note = getPitchFromKeyboardEvent(event);
    if (note != null) {
      tonnetz.noteOn(16, note);
      audio.noteOn(16, note);
      return false;
    }
  };

  var onKeyUp = function(event) {
    var key = event.key;
    if ("Shift" == key)
      tonnetz.panic();

    var note = getPitchFromKeyboardEvent(event);
    if (note != null) {
      tonnetz.noteOff(16, note);
      audio.noteOff(16, note);
      return false;
    }
  };

  return module;
})();
