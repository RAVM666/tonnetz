var colorscheme = (function() {
  "use strict";

  var module = {};

  var STATE_NAMES = ['OFF', 'GHOST', 'SUSTAIN', 'ON'];

  module.scheme = null;

  var schemes = {};
  var customSchemes = {};
  var customCounter;

  module.init = function(schemeName) {
    loadCustomSchemes();

    this.setScheme(schemeName);
  };

  /**
   * Add or replace a color scheme.
   */
  module.addScheme = function(name, data, custom) {
    var displayName = data['name'];

    if (schemes[name]) {  // Replacing an existing scheme
      // Remove old stylesheet
      $(schemes[name].stylesheet.ownerNode).remove();

      // Change option text
      $('#color-scheme option')
        .filter(function() { return $(this).attr('value') == name; })
        .text(displayName);
    } else {
      $('#color-scheme')
        .append($('<option></option>')
        .attr('value', name)
        .text(displayName));
    }

    schemes[name] = {
      'data': data,
      'name': name,
      'stylesheet': addStylesheet(data)
    };
  };

  module.setScheme = function(name) {
    this.scheme = schemes[name];
    var data = this.scheme.data;

    this.stroke = [];
    this.fill = [];
    for (var i = 0; i < STATE_NAMES.length; i++) {
      this.stroke.push(data['nodes'][STATE_NAMES[i]]['stroke']);
      this.fill.push(data['nodes'][STATE_NAMES[i]]['fill']);
    }

    this.minorFill = data['faces']['minor']['fill'];
    this.majorFill = data['faces']['major']['fill'];

    var custom = name.startsWith('custom');
    $('#edit-scheme').parent()
      .add($('#scheme-github').parent())
      .toggle(custom);
    $('#clone-scheme span').toggle(!custom);
  };

  /**
   * Called by `tonnetz` before drawing.
   */
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

  var loadCustomSchemes = function() {
    customCounter = Number(storage.get('colorscheme.customCounter', '0'));
    customSchemes = JSON.parse(storage.get('colorscheme.customSchemes', '{}'));
    for (name in customSchemes) {
      module.addScheme(name, customSchemes[name]);
    }
  };

  var storeCustomSchemes = function() {
    storage.set('colorscheme.customCounter', customCounter);
    storage.set('colorscheme.customSchemes', JSON.stringify(customSchemes));
  };

  var jsonSchema = {
    "type": "object",
    "headerTemplate": "{{ self.name }}",
    "options": {
      "disable_collapse": true,
      "disable_edit_json": false
    },
    "properties": {
      "name": {
        "type": "string",
        "default": "Custom"
      },
      "background": {
        "type": "string",
        "format": "color",
      },
      "nodes": {
        "type": "object",
        "properties": {
          "OFF": {
            "type": "object",
            "properties": {
              "label": {
                "type": "string",
                "format": "color"
              },
              "fill": {
                "type": "string",
                "format": "color"
              },
              "stroke": {
                "type": "string",
                "format": "color"
              }
            },
            "required": [
              "label", "fill", "stroke"
            ],
            "additionalProperties": false
          },
          "GHOST": {
            "type": "object",
            "properties": {
              "label": {
                "type": "string",
                "format": "color"
              },
              "fill": {
                "type": "string",
                "format": "color"
              },
              "stroke": {
                "type": "string",
                "format": "color"
              }
            },
            "required": [
              "label", "fill", "stroke"
            ],
            "additionalProperties": false
          },
          "SUSTAIN": {
            "type": "object",
            "properties": {
              "label": {
                "type": "string",
                "format": "color"
              },
              "fill": {
                "type": "string",
                "format": "color"
              },
              "stroke": {
                "type": "string",
                "format": "color"
              }
            },
            "required": [
              "label", "fill", "stroke"
            ],
            "additionalProperties": false
          },
          "ON": {
            "type": "object",
            "properties": {
              "label": {
                "type": "string",
                "format": "color"
              },
              "fill": {
                "type": "string",
                "format": "color"
              },
              "stroke": {
                "type": "string",
                "format": "color"
              }
            },
            "required": [
              "label", "fill", "stroke"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "OFF", "GHOST", "SUSTAIN", "ON"
        ],
        "additionalProperties": false
      },
      "faces": {
        "type": "object",
        "properties": {
          "major": {
            "type": "object",
            "properties": {
              "label-off": {
                "type": "string",
                "format": "color"
              },
              "label-on": {
                "type": "string",
                "format": "color"
              },
              "fill": {
                "type": "string",
                "format": "color"
              }
            },
            "required": [
              "label-off", "label-on", "fill"
            ],
            "additionalProperties": false
          },
          "minor": {
            "type": "object",
            "properties": {
              "label-off": {
                "type": "string",
                "format": "color"
              },
              "label-on": {
                "type": "string",
                "format": "color"
              },
              "fill": {
                "type": "string",
                "format": "color"
              }
            },
            "required": [
              "label-off", "label-on", "fill"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "major", "minor"
        ],
        "additionalProperties": false
      }
    },
    "required": [
      "name", "background", "nodes", "faces"
    ],
    "additionalProperties": false
  };

  return module;
})();
