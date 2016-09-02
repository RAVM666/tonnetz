var audio = (function() {
	"use strict";

	var Note = function(pitch) {
		var re = Float32Array.from([0, 1]);
		var im = Float32Array.from([0, 0]);
		var wave = ctx.createPeriodicWave(re, im);
		var freq = Math.pow(2, (pitch - 9) / 12) * 440;

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

	var ctx;

	var notes = {};

	module.init = function() {
		var AudioContext = window.AudioContext;

		if (AudioContext)
			ctx = new AudioContext();
	};

	module.noteOn = function(pitch) {
		if (!ctx)
			return;

		if (!(pitch in notes)) {
			notes[pitch] = new Note(pitch);
			notes[pitch].start();
		}
	};

	module.noteOff = function(pitch) {
		if (!ctx)
			return;

		if (pitch in notes) {
			notes[pitch].stop();
			delete notes[pitch];
		}
	};

	module.allNotesOff = function() {
		for (let pitch in notes)
			module.noteOff(pitch);
	};

	return module;
})();
