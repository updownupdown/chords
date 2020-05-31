import React, { useState } from "react";
import * as Tone from "tone";
import * as ChordDetect from "@tonaljs/chord-detect";
import { Wheel } from "./Wheel";
import { Keys } from "./Keys";
import { Selected } from "./Selected";
import { Chords } from "./Chords";
import { Drawer } from "./Drawer";
import { selectedToNotes } from "./Utils";

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
  function updateSelected(index, active) {
    const list = selected;

    if (active) {
      list.push(index);
      list.sort((a, b) => a - b);
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i] === index) {
          list.splice(i, 1);
        }
      }
    }

    setSelected(list);

    // Predict chords
    const chords = ChordDetect.detect(selectedToNotes(list));
    setChordDetect(chords);
  }

  function clearSelected() {
    setSelected([]);
    setChordDetect("");
  }

  return (
    <>
      <div className="layout-keyboard">
        <Wheel />
        <Keys
          piano={piano}
          mouseDown={mouseDown}
          selected={selected}
          updateSelected={updateSelected}
        />
        <Selected selected={selected} clearSelected={clearSelected} />
        <Chords chordDetect={chordDetect} />
      </div>
      <Drawer selected={selected} clearSelected={clearSelected} />
    </>
  );
}

export default Keyboard;
