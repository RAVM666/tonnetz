# Interactive Tonnetz

This is a Web-based music application that receives MIDI input
and visualizes it in real time using the [Tonnetz][1].
It uses the [Web MIDI API][2] supported by Chrome and Opera.
If your browser supports the Web MIDI API, you can use this app
with any MIDI-enabled instrument.
Just connect it to your computer and play.
You can also use your computer's keyboard to control the app.

The Tonnetz is a lattice diagram representing tonal space.
It can be used to visualize harmonic relationships in music.
Each node in the diagram corresponds to one of the twelve tones
and is connected to six adjacent tones that are related to it
by a major third, a minor third, or by a perfect fifth,
depending on their relative position in the diagram.

[1]: https://en.wikipedia.org/wiki/Tonnetz
[2]: https://webaudio.github.io/web-midi-api/
[3]: https://webaudio.github.io/web-audio-api/
