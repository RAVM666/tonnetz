var audio = (function() {
	"use strict";

	var shepard = function(freq) {
		var x = Math.log2(freq / 440);

		return Math.exp(-x * x);
	};

	var createWave = function(freq) {
		var n = 2 ** 5;
		var re = new Float32Array(n);
		var im = new Float32Array(n);

		for (let i = 1; i < n; i *= 2)
			re[i] = shepard(i * freq);

		return ctx.createPeriodicWave(re, im);
	};

	var Note = function(pitch) {
		var freq = Math.pow(2, (pitch - 33) / 12) * 440;
		var wave = createWave(freq);

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
