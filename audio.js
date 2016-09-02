var audio = (function() {
	"use strict";

	var Note = function(pitch) {
		var re = Float32Array.from([0, 1]);
		var im = Float32Array.from([0, 0]);
		var wave = ctx.createPeriodicWave(re, im);
		var freq = Math.pow(2, (pitch - 9) / 12) * 440;

		this.active = false;
		this.oscillator = ctx.createOscillator();
		this.oscillator.frequency.value = freq;
		this.oscillator.setPeriodicWave(wave);
		this.gain = ctx.createGain();
		this.gain.gain.value = 0;
		this.oscillator.connect(this.gain);
		this.gain.connect(ctx.destination);
		this.attack = 0.05;
		this.release = 0.1;
		this.oscillator.start();
	};

	Note.prototype.start = function() {
		if (this.active)
			return;
		else
			this.active = true;

		var end = ctx.currentTime + this.attack;
		var gain = this.gain.gain;

		gain.setValueAtTime(0, ctx.currentTime);
		gain.linearRampToValueAtTime(1 / 12, end);
	};

	Note.prototype.stop = function() {
		if (!this.active)
			return;
		else
			this.active = false;

		var self = this;
		var gain = self.gain.gain;
		var end = ctx.currentTime + self.release;

		gain.setValueAtTime(gain.value, ctx.currentTime);
		gain.linearRampToValueAtTime(0, end);
	};

	var module = {};

	var ctx;

	var notes = [];

	module.init = function() {
		var AudioContext = window.AudioContext;

		if (AudioContext) {
			ctx = new AudioContext();

			for (let t = 0; t < 12; t++)
				notes[t] = new Note(t);

			module.noteOn = function(pitch) {
				notes[pitch].start();
			};

			module.noteOff = function(pitch) {
				notes[pitch].stop();
			};
		}
	};

	module.noteOn = function() {};

	module.noteOff = function() {};

	module.allNotesOff = function() {
		for (let t = 0; t < 12; t++)
			module.noteOff(t);
	};

	return module;
})();
