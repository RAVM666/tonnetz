var tonnetz = (function() {
  "use strict";

  var module = {};

  var TONE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  var STATE_OFF = 0,
      STATE_GHOST = 1,
      STATE_SUST = 2,
      STATE_ON = 3;
  var STATE_NAMES = ['OFF', 'GHOST', 'SUSTAIN', 'ON'];

  var W,  // width
      H,  // height
      u;  // unit distance (distance between neighbors)

  module.density = 22;
  module.ghostDuration = 500;

  var toneGrid = [];
  var tones;
  var channels;

  var sustainEnabled = true,
      sustain = false;

  var CHANNELS = 17;  // the 17th channel is for the computer keyboard


  module.init = function() {
    tones = $.map(Array(12), function(_, i) {
      return {
        'pitch': i,
        'name': TONE_NAMES[i],
        'state': STATE_OFF,
        'byChannel': {},     // counts of this tone in each channel
        'channelsSust': {},  // channels where the tone is sustained
        'released': null,    // the last time the note was on
        'cache': {}          // temporary data
      };
    });

    channels = $.map(Array(CHANNELS), function(_, i) {
      return {
        'number': i,
        'pitches': {},
        'sustTones': {},
        'sustain': false
      };
    });
    module.channels = channels;

    this.rebuild();
    window.onresize = function() { module.rebuild(); };
  };


  module.noteOn = function(c, pitch) {
    if (!(pitch in channels[c].pitches)) {
      var i = pitch%12;
      tones[i].state = STATE_ON;

      if (!tones[i].byChannel[c])
        tones[i].byChannel[c] = 1;
      else
        tones[i].byChannel[c]++;

      channels[c].pitches[pitch] = 1;

      // Remove sustain
      delete tones[i].channelsSust[c];
      delete channels[c].sustTones[i];
    }
    this.draw();
  };

  module.noteOff = function(c, pitch) {
    if (pitch in channels[c].pitches) {
      var i = pitch%12;
      delete channels[c].pitches[pitch];
      tones[i].byChannel[c]--;

      // Check if this was the last instance of the tone in this channel
      if (tones[i].byChannel[c] === 0) {
        delete tones[i].byChannel[c];

        // Check if this was the last channel with this tone
        if ($.isEmptyObject(tones[i].byChannel)) {
          if (sustainEnabled && channels[c].sustain) {
            tones[i].state = STATE_SUST;
            channels[c].sustTones[i] = 1;
          } else {
            // change state to STATE_GHOST or STATE_OFF
            // depending on setting
            releaseTone(tones[i]);
          }
        }
      }

      this.draw();
    }
  };

  module.allNotesOff = function(c) {
    audio.allNotesOff(c);

    for (var i=0; i<12; i++) {
      delete tones[i].byChannel[c];
      delete tones[i].channelsSust[c];

      // Check if this tone is turned off in all channels
      if ($.isEmptyObject(tones[i].byChannel)) {
        tones[i].state = STATE_OFF;
      }
    }

    channels[c].pitches = {};
    channels[c].sustTones = {};

    this.draw();
  };

  module.sustainOn = function(c) {
    channels[c].sustain = true;
  };

  module.sustainOff = function(c) {
    channels[c].sustain = false;
    channels[c].sustTones = {};

    for (var i=0; i<12; i++) {
      delete tones[i].channelsSust[c];

      if (tones[i].state == STATE_SUST &&
          $.isEmptyObject(tones[i].channelsSust)) {
        releaseTone(tones[i]);
      }
    }

    this.draw();
  };

  module.panic = function() {
    for (var i=0; i<CHANNELS; i++) {
      this.sustainOff(i);
      this.allNotesOff(i);
    }
  };


  module.toggleSustainEnabled = function() {
    sustainEnabled = !sustainEnabled;
  };

  module.setDensity = function(density) {
    if (isFinite(density) && density >= 5 && density <= 50) {
      this.density = density;
      this.rebuild();
    }
  };

  module.setGhostDuration = function(duration) {
    if (isFinite(duration) && duration !== null && duration !== '') {
      duration = Number(duration);
      if (duration >= 0) {
        if (duration != this.ghostDuration) {
          this.ghostDuration = duration;
          this.draw();
        }
        return true;
      }
    }

    return false;
  };


  var releaseTone = function(tone) {
    tone.release = new Date();
    if (module.ghostDuration > 0) {
      tone.state = STATE_GHOST;
      ghosts();
    } else {
      tone.state = STATE_OFF;
    }
  };


  var ghostsInterval = null;

  /**
   * Check for dead ghost tones and turn them off. Keep
   * checking using setInterval as long as there are
   * any ghost tones left.
   */
  var ghosts = function() {
    if (ghostsInterval === null) {
      ghostsInterval = setInterval(function() {
        var numAlive = 0, numDead = 0;
        var now = new Date();

        for (var i=0; i<12; i++) {
          if (tones[i].state == STATE_GHOST) {
            if (now - tones[i].release >= module.ghostDuration) {
              tones[i].state = STATE_OFF;
              numDead++;
            } else {
              numAlive++;
            }
          }
        }

        if (numAlive == 0) {
          clearInterval(ghostsInterval);
          ghostsInterval = null;
        }

        if (numDead>0)
          module.draw();
      }, Math.min(module.ghostDuration, 30));
    }
  };


  var drawTimeout = null;

  /**
   * Request a redraw. If true is passed as a parameter, redraw immediately.
   * Otherwise, draw at most once every 30 ms.
   */
  module.draw = function(immediately) {
    if (immediately) {
      if (drawTimeout !== null) {
        clearTimeout(drawTimeout);
      }
      drawNow();
    } else if (drawTimeout === null) {
      drawTimeout = setTimeout(drawNow, 30);
    }
  };

  var drawNow = function() {
    drawTimeout = null;

    var now = new Date();

    ctx.clearRect(0, 0, W, H);

    // Fill faces. Each vertex takes care of the two faces above it.
    for (var tone=0; tone<12; tone++) {
      var c = tones[tone].cache;

      var leftNeighbor = (tone+3)%12;
      var rightNeighbor = (tone+4)%12;
      var topNeighbor = (tone+7)%12;

      c.leftPos = getNeighborXYDiff(tone, leftNeighbor);
      c.rightPos = getNeighborXYDiff(tone, rightNeighbor);
      c.topPos = getNeighborXYDiff(tone, topNeighbor);

      c.leftState = tones[leftNeighbor].state;
      c.rightState = tones[rightNeighbor].state;
      c.topState = tones[topNeighbor].state;

      var thisOn = (tones[tone].state != STATE_OFF);
      var leftOn = (c.leftState != STATE_OFF);
      var rightOn = (c.rightState != STATE_OFF);
      var topOn = (c.topState != STATE_OFF);

      // Fill faces
      for (var i=0; i<toneGrid[tone].length; i++) {
        setTranslate(ctx, toneGrid[tone][i].x, toneGrid[tone][i].y);

        var minorOn = false, majorOn = false;
        if (thisOn && topOn) {
          if (leftOn) { // left face (minor triad)
            minorOn = true;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(c.topPos.x, c.topPos.y);
            ctx.lineTo(c.leftPos.x, c.leftPos.y);
            ctx.closePath();
            ctx.fillStyle = colors.minorFill;
            ctx.fill();
          }
          if (rightOn) { // right face (major triad)
            majorOn = true;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(c.topPos.x, c.topPos.y);
            ctx.lineTo(c.rightPos.x, c.rightPos.y);
            ctx.closePath();
            ctx.fillStyle = colors.majorFill;
            ctx.fill();
          }
        }

        var $minorTriadLabel = $(toneGrid[tone][i].minorTriadLabel);
        var $majorTriadLabel = $(toneGrid[tone][i].majorTriadLabel);

        if (minorOn) {
          $minorTriadLabel.addClass('state-ON');
        } else {
          $minorTriadLabel.removeClass('state-ON');
        }

        if (majorOn) {
          $majorTriadLabel.addClass('state-ON');
        } else {
          $majorTriadLabel.removeClass('state-ON');
        }
      }
    }

    // Draw edges. Each vertex takes care of the three upward edges.
    for (var tone=0; tone<12; tone++) {
      var c = tones[tone].cache;
      var state = tones[tone].state;

      for (var i=0; i<toneGrid[tone].length; i++) {
        setTranslate(ctx, toneGrid[tone][i].x, toneGrid[tone][i].y);

        drawEdge(ctx, c.topPos, state, c.topState);
        drawEdge(ctx, c.leftPos, state, c.leftState);
        drawEdge(ctx, c.rightPos, state, c.rightState);
      }
    }

    setTranslate(ctx, 0, 0);

    // Draw vertices.
    for (var tone=0; tone<12; tone++) {
      for (var i=0; i<toneGrid[tone].length; i++) {
        var x = toneGrid[tone][i].x, y = toneGrid[tone][i].y;
        ctx.beginPath();
        ctx.arc(x, y, u/5, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.fillStyle = colors.fill[tones[tone].state];
        ctx.strokeStyle = colors.stroke[tones[tone].state];
        toneGrid[tone][i].label.className = 'state-' + STATE_NAMES[tones[tone].state];

        if (tones[tone].state == STATE_OFF) {
          ctx.lineWidth = 1;
        } else {
          ctx.lineWidth = 2;
        }

        ctx.fill();
        ctx.stroke();
      }
    }
  };

  var setTranslate = function(ctx, x, y) {
    ctx.setTransform(1, 0, 0, 1, x, y);
  };

  var drawEdge = function(ctx, endpoint, state1, state2) {
    var state = Math.min(state1, state2);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(endpoint.x, endpoint.y);
    ctx.strokeStyle = colors.stroke[state];
    ctx.lineWidth = (state != STATE_OFF) ? 1.5 : 1;
    ctx.stroke();
  };

  var getNeighborXYDiff = function(t1, t2) {
    const diff = (t2 - t1 + 12) % 12;
    const h = 2 * Math.sqrt(3);
    var x, y;

    if (3 == diff) {
      x = 3;
      y = -h;
    } else if (7 == diff) {
      x = 7;
      y = 0;
    } else if (4 == diff) {
      x = 4;
      y = h;
    } else if (9 == diff) {
      x = -3;
      y = h;
    } else if (5 == diff) {
      x = -7;
      y = 0;
    } else if (8 == diff) {
      x = -4;
      y = -h;
    }

    return {
      x: u * x / 5,
      y: u * y / 5
    };
  };

  var createLabel = function(text, x, y) {
    var label = document.createElement('div');
    var inner = document.createElement('div');
    inner.appendChild(document.createTextNode(text));
    label.appendChild(inner);
    label.style.left = x + 'px';
    label.style.top = y + 'px';
    return label;
  };

  var addNode = function(tone, x, y) {
    if (x < -u || y < -u || x > W + u || y > H + u)
      return;

    const d3 = getNeighborXYDiff(0, 3);
    const d4 = getNeighborXYDiff(0, 4);
    const d7 = getNeighborXYDiff(0, 7);
    const minor = {
      x: x + (d3.x + d7.x) / 3,
      y: y + (d3.y + d7.y) / 3
    };
    const major = {
      x: x + (d4.x + d7.x) / 3,
      y: y + (d4.y + d7.y) / 3
    };
    const name = tones[tone].name;
    const nameUp = name.toUpperCase();
    const nameLow = name.toLowerCase();
    const node = {
      x: x,
      y: y
    };

    node.label = createLabel(name, x, y);
    noteLabels.appendChild(node.label);

    node.majorTriadLabel = createLabel(nameUp, major.x, major.y);
    node.minorTriadLabel = createLabel(nameLow, minor.x, minor.y);
    node.majorTriadLabel.className = 'major';
    node.minorTriadLabel.className = 'minor';
    triadLabels.appendChild(node.majorTriadLabel);
    triadLabels.appendChild(node.minorTriadLabel);

    toneGrid[tone].push(node);
  };

  module.rebuild = function() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    u = (W + H) / this.density;

    const d3 = getNeighborXYDiff(0, 3);
    const d4 = getNeighborXYDiff(0, 4);
    const r3 = Math.sqrt(d3.x * d3.x + d3.y * d3.y);
    const r4 = Math.sqrt(d4.x * d4.x + d4.y * d4.y);
    const r = Math.sqrt(W * W / 4 + H * H / 4);
    const n3 = Math.ceil(r / r3) + 1;
    const n4 = Math.ceil(r / r4) + 1;

    for (let i = 0; i < 12; i++)
      toneGrid[i] = [];

    $(noteLabels).empty();
    $(triadLabels).empty();

    $(noteLabels).css("font-size", u * 0.17 + "px");
    $(triadLabels).css("font-size", u * 0.17 + "px");

    for (let i3 = -n3; i3 <= n3; i3++) {
      for (let i4 = -n4; i4 <= n4; i4++) {
        let t = ((8 + 3 * i3 + 4 * i4) % 12 + 12) % 12;
        let x = W / 2 + i3 * d3.x + i4 * d4.x;
        let y = H / 2 + i3 * d3.y + i4 * d4.y;

        addNode(t, x, y);
      }
    }

    this.draw(true);
  };

  return module;
})();
