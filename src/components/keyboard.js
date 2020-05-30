import React, { useState } from "react";
import * as Tone from "tone";
import * as ChordDetect from "@tonaljs/chord-detect";
import { Keys } from "./Keys";
import { Selected } from "./Selected";
import { Chords } from "./Chords";

const piano = new Tone.Sampler(
  {
    C3: "C3v8.mp3",
    C4: "C4v8.mp3",
    C5: "C5v8.mp3",
    C6: "C6v8.mp3",
    "F#3": "Fs3v8.mp3",
    "F#4": "Fs4v8.mp3",
    "F#5": "Fs5v8.mp3",
    "F#6": "Fs6v8.mp3",
    A3: "A3v8.mp3",
    A4: "A4v8.mp3",
    A5: "A5v8.mp3",
    A6: "A6v8.mp3",
  },
  {
    release: 1.2,
    baseUrl: process.env.PUBLIC_URL + "./samples/",
    // onload: pianoReady,
  }
);
piano.volume.value = -5;
piano.toDestination();

// Keyboard
function Keyboard() {
  // Selected Keys
  const [selected, setSelected] = useState([]);

  // Chord Detection
  const [chordDetect, setChordDetect] = useState("");

  // Mouse down (for keyboard swiping)
  const [mouseDown, setMouseDown] = useState(false);
  function setLeftButtonState(e) {
    setMouseDown(e.buttons === undefined ? e.which === 1 : e.buttons === 1);
  }
  document.body.onmousedown = setLeftButtonState;
  document.body.onmouseup = setLeftButtonState;

  // Update selected notes
  function updateSelected(note, active) {
    const list = selected;

    if (active) {
      list.push(note);
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === note) {
          list.splice(i, 1);
        }
      }
    }

    setSelected(list);

    // Predict chords
    const chords = ChordDetect.detect(list);
    setChordDetect(chords);
  }

  return (
    <>
      {/* <Shortcuts piano={piano} /> */}
      <Keys
        piano={piano}
        mouseDown={mouseDown}
        selected={selected}
        updateSelected={updateSelected}
      />
      <Selected selected={selected} />
      <Chords chordDetect={chordDetect} />
    </>
  );
}

export default Keyboard;
