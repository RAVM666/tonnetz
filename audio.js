var audio = (function() {
	"use strict";

	var Note = function(ctx, frequency, output) {
		var attack = 0.05;
		var release = 0.1;
		var type = "sine";

		this.oscillator = ctx.createOscillator();
		this.oscillator.type = type;
		this.oscillator.frequency.value = frequency;
		this.gain = ctx.createGain();
		this.gain.gain.value = 0;

		this.oscillator.connect(this.gain);
		this.gain.connect(output);

		this.ctx = ctx;
		this.attack = attack;
		this.release = release;
	};

	Note.prototype.start = function() {
		var end = this.ctx.currentTime + this.attack;
		var gain = this.gain.gain;

		this.oscillator.start();
		gain.setValueAtTime(0, this.ctx.currentTime);
		gain.linearRampToValueAtTime(1, end);
	};

	Note.prototype.stop = function() {
		var self = this;
		var gain = self.gain.gain;
		var end = self.ctx.currentTime + self.release;

		gain.setValueAtTime(gain.value, self.ctx.currentTime);
		gain.linearRampToValueAtTime(0, end);

		setTimeout(function() {
			self.gain.disconnect();
			self.oscillator.stop();
			self.oscillator.disconnect();
		}, Math.floor(self.release * 1000));
	};

	var module = {};

	var audioCtx, notes, gain;

	var CHANNELS = 17;

	module.init = function() {
		var AudioContext = window.AudioContext;

		if (AudioContext) {
			audioCtx = new AudioContext();
			gain = audioCtx.createGain();
			gain.connect(audioCtx.destination);
		}

		notes = $.map(Array(CHANNELS), function() {
			return {};
		});

		gain.gain.value = 0.3;
	};

	module.noteOn = function(channel, pitch) {
		if (!audioCtx)
			return;

		if (!(pitch in notes[channel])) {
			let freq = Math.pow(2, (pitch - 69) / 12) * 440;

			notes[channel][pitch] = new Note(audioCtx, freq, gain);
			notes[channel][pitch].start();
		}
	};

	module.noteOff = function(channel, pitch) {
		if (!audioCtx)
			return;

		if (pitch in notes[channel]) {
			notes[channel][pitch].stop();
			delete notes[channel][pitch];
		}
	};

	module.allNotesOff = function(channel) {
		for (let i = 0; i < CHANNELS; i++)
			for (let pitch in notes[channel])
				module.noteOff(channel, pitch);
	};

	return module;
})();
