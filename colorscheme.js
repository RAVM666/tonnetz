var colorscheme = (function() {
  "use strict";

  var module = {};

  var STATE_NAMES = ['OFF', 'GHOST', 'SUSTAIN', 'ON'];

  module.scheme = null;

  var schemes = {};

  module.addScheme = function(name, data) {
    schemes[name] = {
      'data': data,
      'name': name,
      'stylesheet': addStylesheet(data)
    };
  };

  module.init = function() {
    this.scheme = schemes["default"];
    var data = this.scheme.data;

    this.stroke = [];
    this.fill = [];
    for (var i = 0; i < STATE_NAMES.length; i++) {
      this.stroke.push(data['nodes'][STATE_NAMES[i]]['stroke']);
      this.fill.push(data['nodes'][STATE_NAMES[i]]['fill']);
    }

    this.minorFill = data['faces']['minor']['fill'];
    this.majorFill = data['faces']['major']['fill'];
  };

  module.update = function() {
    this.scheme.stylesheet.disabled = false;

    for (name in schemes) {
      if (name != this.scheme.name)
        schemes[name].stylesheet.disabled = true;
    }
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

    sheet.disabled = true;

    return sheet;
  };

  return module;
})();
