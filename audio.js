var audio = (function() {
	"use strict";

	var Note = function(freq) {
		var re = Float32Array.from([0, 1]);
		var im = Float32Array.from([0, 0]);
		var wave = ctx.createPeriodicWave(re, im);

		this.oscillator = ctx.createOscillator();
		this.oscillator.frequency.value = freq;
		this.oscillator.setPeriodicWave(wave);
		this.gain = ctx.createGain();
		this.gain.gain.value = 0;

		this.oscillator.connect(this.gain);
		this.gain.connect(ctx.destination);

		this.attack = 0.05;
		this.release = 0.1;
	};

	Note.prototype.start = function() {
		var end = ctx.currentTime + this.attack;
		var gain = this.gain.gain;

		this.oscillator.start();
		gain.setValueAtTime(0, ctx.currentTime);
		gain.linearRampToValueAtTime(1 / 12, end);
	};

	Note.prototype.stop = function() {
		var self = this;
		var gain = self.gain.gain;
		var end = ctx.currentTime + self.release;

		gain.setValueAtTime(gain.value, ctx.currentTime);
		gain.linearRampToValueAtTime(0, end);

		setTimeout(function() {
			self.gain.disconnect();
			self.oscillator.stop();
			self.oscillator.disconnect();
		}, Math.floor(self.release * 1000));
	};

	var module = {};

	var ctx, notes;

	var CHANNELS = 17;

	module.init = function() {
		var AudioContext = window.AudioContext;

		if (AudioContext)
			ctx = new AudioContext();

		notes = $.map(Array(CHANNELS), function() {
			return {};
		});
	};

	module.noteOn = function(channel, pitch) {
		if (!ctx)
			return;

		if (!(pitch in notes[channel])) {
			let freq = Math.pow(2, (pitch - 69) / 12) * 440;

			notes[channel][pitch] = new Note(freq);
			notes[channel][pitch].start();
		}
	};

	module.noteOff = function(channel, pitch) {
		if (!ctx)
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
