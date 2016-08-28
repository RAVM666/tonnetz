var colors = (function() {
  "use strict";

  var module = {};

  var STATE_NAMES = ['OFF', 'GHOST', 'SUSTAIN', 'ON'];

  var data = {
    "background": "#ffffff",
    "nodes": {
      "OFF": {
        "label": "#aaaaaa",
        "fill": "#ffffff",
        "stroke": "#bababa"
      },
      "GHOST": {
        "label": "#ffffff",
        "fill": "#aeaeae",
        "stroke": "#bababa"
      },
      "SUSTAIN": {
        "label": "#d1dbf0",
        "fill": "#46629e",
        "stroke": "#0e1f5b"
      },
      "ON": {
        "label": "#ffffff",
        "fill": "#2c4885",
        "stroke": "#0e1f5b"
      }
    },
    "faces": {
      "major": {
        "label-off": "#c0c0c0",
        "label-on": "#bea866",
        "fill": "#faf7db"
      },
      "minor": {
        "label-off": "#c0c0c0",
        "label-on": "#aa9b68",
        "fill": "#eeebc9"
      }
    }
  };

  module.init = function() {
    addStylesheet(data);

    this.stroke = [];
    this.fill = [];
    for (var i = 0; i < STATE_NAMES.length; i++) {
      this.stroke.push(data['nodes'][STATE_NAMES[i]]['stroke']);
      this.fill.push(data['nodes'][STATE_NAMES[i]]['fill']);
    }

    this.minorFill = data['faces']['minor']['fill'];
    this.majorFill = data['faces']['major']['fill'];
  };

  var addStylesheet = function(scheme) {
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    var sheet = style.sheet || style.styleSheet;

    sheet.insertRule('#tonnetz { background: ' + scheme['background'] + '}', 0);

    $.each(STATE_NAMES, function(i, state) {
      sheet.insertRule('#note-labels .state-' + state + ' { color: ' +
        scheme['nodes'][state]['label'] + ' }', 0);
    });

    $.each(['minor', 'major'], function(i, type) {
      sheet.insertRule('#triad-labels .' + type + ' { color: ' +
        scheme['faces'][type]['label-off'] + '}', 0);
      sheet.insertRule('#triad-labels .' + type + '.state-ON { color: ' +
        scheme['faces'][type]['label-on'] + '}', 0);
    });
  };

  return module;
})();
