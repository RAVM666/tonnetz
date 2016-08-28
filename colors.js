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
        "fill-off": "#ffffff", // "#f2dede",
        "fill-on": "#faf7db" // "#d9534f"
      },
      "minor": {
        "fill-off": "#ffffff", // "#d9edf7",
        "fill-on": "#eeebc9" // "#337ab7"
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

    this.minorFillOn = data['faces']['minor']['fill-on'];
    this.majorFillOn = data['faces']['major']['fill-on'];
    this.minorFillOff = data['faces']['minor']['fill-off'];
    this.majorFillOff = data['faces']['major']['fill-off'];
  };

  return module;
})();
