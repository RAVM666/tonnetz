var keyboard = (function() {
  "use strict";

  var module = {};

  var map = {};

  var keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
  ];

  for (let i = 0; i < keys.length; i++) {
    let row = keys[i];

    for (let j = 0; j < row.length; j++) {
      let key = row[j];

      map[key] = (4 * i + 7 * j) % 12;
    }
  }

  var base = 60;

  module.init = function() {
    $(window).keydown(onKeyDown);
    $(window).keyup(onKeyUp);
  };

  var getPitchFromKeyboardEvent = function(event) {
    var note = base + map[event.key];

    if (isFinite(note) && !event.ctrlKey && !event.altKey && !event.metaKey)
      return note;
    else
      return null;
  };

  var onKeyDown = function(event) {
    if (somethingHasFocus()) return;

    var key = event.key;
    if (" " == key)
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
    if (somethingHasFocus()) return;

    var key = event.key;
    if (" " == key)
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
