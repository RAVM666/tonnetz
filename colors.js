var colors = (function() {
  "use strict";

  var module = {};

  var STATE_NAMES = ["OFF", "GHOST", "SUSTAIN", "ON"];

  var data = {
    nodes: {
      OFF: {
        fill: "#eeeeee",
        stroke: "#555555"
      },
      GHOST: {
        fill: "#777777",
        stroke: "#333333"
      },
      SUSTAIN: {
        fill: "#555555",
        stroke: "#333333"
      },
      ON: {
        fill: "#333333",
        stroke: "#000000"
      }
    },
    faces: {
      major: {
        fillOFF: "#f2dede",
        fillON: "#d9534f"
      },
      minor: {
        fillOFF: "#d9edf7",
        fillON: "#337ab7"
      }
    }
  };

  module.init = function() {
    this.stroke = [];
    this.fill = [];
    for (var i = 0; i < STATE_NAMES.length; i++) {
      this.stroke.push(data.nodes[STATE_NAMES[i]].stroke);
      this.fill.push(data.nodes[STATE_NAMES[i]].fill);
    }

    this.minorFillOn = data.faces.minor.fillON;
    this.majorFillOn = data.faces.major.fillON;
    this.minorFillOff = data.faces.minor.fillOFF;
    this.majorFillOff = data.faces.major.fillOFF;
  };

  return module;
})();
