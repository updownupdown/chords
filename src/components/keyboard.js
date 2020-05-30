import React, { useState } from "react";
import * as Tone from "tone";
import * as ChordDetect from "@tonaljs/chord-detect";
import { keys } from "./keys";
import classNames from "classnames";

let piano = new Tone.Sampler(
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

// Keyboard
function Keyboard() {
  // Selected Keys
  const [selected, setSelected] = useState([]);
  const [chordDetect, setChordDetect] = useState("");
  const [mouseDown, setMouseDown] = useState(0);

  document.body.onmousedown = function () {
    setMouseDown(1);
  };
  document.body.onmouseup = function () {
    setMouseDown(0);
  };

  function updateSelected(note, active) {
    // Update selected notes
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

  const keyList = keys.map((key) => (
    <Key
      key={key.note}
      color={key.color}
      label={key.label}
      note={key.note}
      updateSelected={(note, active) => {
        updateSelected(note, active);
      }}
      mouseDown={mouseDown}
    />
  ));

  return (
    <>
      <div className="kb">{keyList}</div>
      <Selected selected={selected} />
      <Chords chordDetect={chordDetect} />
    </>
  );
}

// Individual Keys
function Key(props) {
  const [active, setActive] = useState(false);

  return (
    <button
      className={classNames(`key key-${props.color}`, {
        active: active,
      })}
      onMouseDown={() => {
        piano.triggerAttack(props.note);
        props.updateSelected(props.note, !active);
        setActive(!active);
      }}
      onMouseUp={() => {
        piano.triggerRelease(props.note);
      }}
      onMouseLeave={() => {
        piano.triggerRelease(props.note);
      }}
      onMouseEnter={() => {
        if (props.mouseDown) {
          piano.triggerAttackRelease(props.note, "8n");
        }
      }}
    >
      <div className="key-label">{props.label}</div>
    </button>
  );
}

// Selected Keys
function Selected(props) {
  return (
    <div className="selected">
      <span>
        Selected keys:
        <span className={`list ${!props.selected.length && "empty"}`}>
          {props.selected.length
            ? props.selected.join(", ")
            : "no keys selected..."}
        </span>
      </span>
    </div>
  );
}

// Chords
function Chords(props) {
  return (
    <div className="chords">
      <span>
        Predicted chords:
        <span className={`list ${!props.chordDetect.length && "empty"}`}>
          {props.chordDetect.length
            ? props.chordDetect.join(", ")
            : "no chords detected..."}
        </span>
      </span>
    </div>
  );
}

export default Keyboard;
