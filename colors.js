var colors = (function() {
  "use strict";

  var module = {};

  var STATE_NAMES = ['OFF', 'GHOST', 'SUSTAIN', 'ON'];

  var data = {
    "nodes": {
      "OFF": {
        "fill": "#ffffff",
        "stroke": "#bababa"
      },
      "GHOST": {
        "fill": "#aeaeae",
        "stroke": "#bababa"
      },
      "SUSTAIN": {
        "fill": "#46629e",
        "stroke": "#0e1f5b"
      },
      "ON": {
        "fill": "#2c4885",
        "stroke": "#0e1f5b"
      }
    },
    "faces": {
      "major": {
        "fill": "#faf7db"
      },
      "minor": {
        "fill": "#eeebc9"
      }
    }
  };

  module.init = function() {
    this.stroke = [];
    this.fill = [];
    for (var i = 0; i < STATE_NAMES.length; i++) {
      this.stroke.push(data['nodes'][STATE_NAMES[i]]['stroke']);
      this.fill.push(data['nodes'][STATE_NAMES[i]]['fill']);
    }

    this.minorFill = data['faces']['minor']['fill'];
    this.majorFill = data['faces']['major']['fill'];
  };

  return module;
})();
