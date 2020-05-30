import React, { useState } from "react";
import * as Tone from "tone";
import * as ChordDetect from "@tonaljs/chord-detect";
import { keys, shortcuts } from "./keys";
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
      shortcut={key.shortcut}
      updateSelected={(note, active) => {
        updateSelected(note, active);
      }}
      mouseDown={mouseDown}
    />
  ));

  return (
    <>
      {/* <Shortcuts /> */}
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
      data-note={props.note}
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
      {props.shortcut && (
        <div className="key-shortcut">
          <span className="key-shortcut-line"></span>
          <span className="key-shortcut-btn">{props.shortcut}</span>
        </div>
      )}
    </button>
  );
}

// Selected Keys
function Selected(props) {
  return (
    <div className="selected">
      <span>
        <span className="list-label">Selected keys:</span>
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
        <span className="list-label">Predicted chords:</span>
        <span className={`list ${!props.chordDetect.length && "empty"}`}>
          {props.chordDetect.length
            ? props.chordDetect.join(", ")
            : "no chords detected..."}
        </span>
      </span>
    </div>
  );
}

// Shortcut Indicators
// function Shortcuts() {
//   return (
//     <div className="shortcuts">
//       {Object.keys(shortcuts).map((key, i) => (
//         <span
//           className={`shortcuts-key ${
//             shortcuts[key].includes("#") ? "black" : "white"
//           }`}
//         >
//           {key}
//         </span>
//       ))}
//     </div>
//   );
// }

// Key Down
var keyDown = false;
document.addEventListener("keydown", (e) => {
  if (keyDown) {
    if (e.key === " ") {
      console.log(
        "Later, this should toggle the follow key: " + shortcuts[e.key]
      );
    } else {
      return;
    }
  }

  keyDown = true;

  if (e.key in shortcuts) {
    var key = document.querySelector(`[data-note='${shortcuts[e.key]}']`);
    if (key !== undefined) {
      key.classList.add("pressed");
    }

    piano.triggerAttack(shortcuts[e.key]);
  }

  return;
});

// Key Up
document.addEventListener("keyup", (e) => {
  keyDown = false;

  if (e.key in shortcuts) {
    var key = document.querySelector(`[data-note='${shortcuts[e.key]}']`);
    if (key !== undefined) {
      key.classList.remove("pressed");
    }
    piano.triggerRelease(shortcuts[e.key]);
  }
});

export default Keyboard;
