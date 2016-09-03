# Interactive Tonnetz

This is a Web-based music application that receives MIDI input
and visualizes it in real time using the [Tonnetz][1].
If your browser supports [Web MIDI][2], you can use this app
with any MIDI-enabled instrument.
Just connect it to your computer and play.
You can also use your computer keyboard to control the app.

The Tonnetz is a lattice diagram representing tonal space.
It can be used to visualize harmonic relationships in music.
Each node in the diagram corresponds to one of the twelve tones
and is connected to six adjacent tones that are related to it
by a major third, a minor third, or by a perfect fifth,
depending on their relative position in the diagram.

### Features

* Zero configuration
* Tonnetz-like keyboard layout
* [Shepard tones][3] using [Web Audio][4]
* Plug and play MIDI support
* Blue minor and red major triads
* Tonnetz bent to represent halftones
* Shift key to sustain notes
* Arrow keys to transpose

[1]: https://en.wikipedia.org/wiki/Tonnetz
[2]: https://webaudio.github.io/web-midi-api/
[3]: https://en.wikipedia.org/wiki/Shepard_tone
[4]: https://webaudio.github.io/web-audio-api/

## License

Copyright (c) 2016 Ondřej Cífka, Anton Salikhmetov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
