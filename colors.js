var colors = (function() {
  "use strict";

  var module = {};

  var STATE_NAMES = ['OFF', 'GHOST', 'SUSTAIN', 'ON'];

  var data = {
    "nodes": {
      "OFF": {
        "fill": "#eeeeee",
        "stroke": "#555555"
      },
      "GHOST": {
        "fill": "#777777",
        "stroke": "#333333"
      },
      "SUSTAIN": {
        "fill": "#555555",
        "stroke": "#333333"
      },
      "ON": {
        "fill": "#333333",
        "stroke": "#000000"
      }
    },
    "faces": {
      "major": {
        "fill-off": "#f2dede",
        "fill-on": "#d9534f"
      },
      "minor": {
        "fill-off": "#d9edf7",
        "fill-on": "#337ab7"
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
