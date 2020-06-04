import React, { useState } from "react";
import * as Tone from "tone";
import { Key, Note } from "@tonaljs/tonal";
import * as ChordDetect from "@tonaljs/chord-detect";
import { Wheel } from "./Wheel";
import { KeyChart } from "./KeyChart";
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
  }
);
piano.volume.value = -5;
piano.toDestination();
Tone.context.resume();

// Keyboard
function Keyboard() {
  // Selected Keys (notes)
  const [selectedMidi, setSelectedMidi] = useState([]);

  // Chord Detection
  const [chordDetect, setChordDetect] = useState("");

  // Selected Key
  const [myKey, setMyKey] = useState({ key: {}, note: "", type: "" });

  // to handle playing keys by dragging mouse while mouse is down
  const [mouseDown, setMouseDown] = useState(false);

  // for auto play keys
  const autoplayDelay = 0.3;
  const autoplayLength = "8n";

  function setKey(key, note, type) {
    setMyKey({ key: key, note: note, type: type });

    var scale = pitchedScale(key, type);
    var selected = [];

    for (var i = 0; i < scale.length; i++) {
      var midi = Note.midi(scale[i]);

      selected.push(midi);
    }

    setSelectedMidi(selected);
  }

  function findKey(note, type) {
    var key = {};
    if (type === "major") {
      key = Key.majorKey(note);
    } else if (type === "minor") {
      key = Key.minorKey(note);
    } else {
      return;
    }

    setKey(key, note, type);
  }

  function setLeftButtonState(e) {
    setMouseDown(e.buttons === undefined ? e.which === 1 : e.buttons === 1);
  }
  document.body.onmousedown = setLeftButtonState;
  document.body.onmouseup = setLeftButtonState;

  // Update selected notes
  function updateSelected(index, active) {
    const list = selectedMidi;

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

    setSelectedMidi(list);

    // Predict chords
    const chords = ChordDetect.detect(selectedToNotes(list));
    setChordDetect(chords);
  }

  function clearSelected() {
    setSelectedMidi([]);
    setChordDetect("");
  }

  var timeouts = [];

  function cancelTimeouts() {
    // console.log("cancelTimeouts...");
    // console.log(timeouts);

    for (var i = 0; i < timeouts.length; i++) {
      clearTimeout(timeouts[i]);
      // console.log("clearing timeout");
    }
    timeouts = [];

    document.querySelector(".key").classList.remove("pressed");
  }

  function highlightKeys(playlist) {
    for (let i = 0; i < playlist.length; i++) {
      var midi = Note.midi(playlist[i].note);

      let keyToPress = document.querySelector(`.key[data-midi='${midi}'`);

      timeouts.push(
        setTimeout(() => {
          keyToPress.classList.add("highlighted");
        }, autoplayDelay * i * 1000)
      );

      timeouts.push(
        setTimeout(function () {
          keyToPress.classList.remove("highlighted");
        }, autoplayDelay * i * 1000 + autoplayDelay * 1000)
      );
    }

    // console.log(timeouts);
  }

  function scaleFromKey(key, type) {
    // console.log(myKey);
    // console.log(key);
    // console.log(type);
    if (type === "major") {
      return key.scale;
    } else if (type === "minor") {
      return key.natural.scale;
    }
    return;
  }

  function pitchedScale(key, type, startPitch = 4) {
    // console.log(myKey);
    var pitch = startPitch;
    var scale = scaleFromKey(key, type);
    var pitched = [];

    // console.log(scale);

    for (var i = 0; i < scale.length; i++) {
      pitched.push(scale[i] + pitch.toString());

      if (scale[i].includes("B")) {
        pitch++;
      }
    }
    pitched.push(scale[0] + pitch.toString());

    return pitched;
  }

  function playPlaylist(playlist) {
    // Cancel play in progress
    Tone.Transport.cancel(0);

    // Cancel/reset key highlights
    cancelTimeouts();

    new Tone.Part(function (time, note) {
      piano.triggerAttackRelease(note.note, note.duration, time);
    }, playlist).start();
    Tone.Transport.start();

    // Highlight keys
    highlightKeys(playlist);
  }

  function playSelectedKeys() {
    if (selectedMidi.length === 0) return;

    const playlist = [];
    for (var i = 0; i < selectedMidi.length; i++) {
      playlist.push({
        time: i * autoplayDelay,
        note: Note.fromMidi(selectedMidi[i]),
        duration: autoplayLength,
      });
    }

    playPlaylist(playlist);
  }

  function playScale() {
    if (Object.keys(myKey.key).length === 0) {
      return;
    }

    var scale = pitchedScale(myKey.key, myKey.type);

    const playlist = [];
    for (var i = 0; i < scale.length; i++) {
      playlist.push({
        time: i * autoplayDelay,
        note: scale[i],
        duration: autoplayLength,
      });
    }

    playPlaylist(playlist);
  }

  function pianoAttack(note) {
    piano.triggerAttack(note);
  }
  function pianoRelease(note) {
    piano.triggerRelease(note);
  }
  function pianoAttackRelease(note, duration) {
    piano.triggerAttackRelease(note, duration);
  }

  return (
    <>
      <div className="layout-keyboard">
        <div className="wheel-and-chart">
          <Wheel playScale={playScale} findKey={findKey} myKey={myKey} />
          <KeyChart myKey={myKey} />
        </div>
        <Keys
          pianoAttack={pianoAttack}
          pianoRelease={pianoRelease}
          pianoAttackRelease={pianoAttackRelease}
          mouseDown={mouseDown}
          selectedMidi={selectedMidi}
          updateSelected={updateSelected}
          playSelectedKeys={playSelectedKeys}
        />
        <Selected selectedMidi={selectedMidi} clearSelected={clearSelected} />
        <Chords chordDetect={chordDetect} />
      </div>
      <Drawer
        selectedMidi={selectedMidi}
        clearSelected={clearSelected}
        playSelectedKeys={playSelectedKeys}
      />
    </>
  );
}

export default Keyboard;
