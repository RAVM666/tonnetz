var canvas, ctx, noteLabels, triadLabels;

$(function() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  noteLabels = document.getElementById("note-labels");
  triadLabels = document.getElementById("triad-labels");

  storage.init();
  colors.init();
  audio.init();
  tonnetz.init();
  midi.init();
  keyboard.init();
});
