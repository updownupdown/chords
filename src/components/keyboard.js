import React, { useState } from "react";
import * as Tone from "tone";
import * as ChordDetect from "@tonaljs/chord-detect";
import classNames from "classnames";

// Synth
const synth = new Tone.Synth({
  oscillator: {
    type: "sine",
    modulationFrequency: 2,
  },
});
synth.volume.value = -20;
synth.toDestination();

const keys = [
  {
    color: "white",
    label: "C",
    note: "C",
  },
  {
    color: "black",
    label: "C#",
    note: "C#",
  },
  {
    color: "white",
    label: "D",
    note: "D",
  },
  {
    color: "black",
    label: "D#",
    note: "D#",
  },
  {
    color: "white",
    label: "E",
    note: "E",
  },
  {
    color: "white",
    label: "F",
    note: "F",
  },
  {
    color: "black",
    label: "F#",
    note: "F#",
  },
  {
    color: "white",
    label: "G",
    note: "G",
  },
  {
    color: "black",
    label: "G#",
    note: "G#",
  },
  {
    color: "white",
    label: "A",
    note: "A",
  },
  {
    color: "black",
    label: "A#",
    note: "A#",
  },
  {
    color: "white",
    label: "B",
    note: "B",
  },
  {
    color: "black",
    label: "B#",
    note: "B#",
  },
];

// Keyboard
function Keyboard() {
  // Selected Keys
  const [selected, setSelected] = useState([]);
  const [chordDetect, setChordDetect] = useState("");

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
      note={`${key.note}4`}
      updateSelected={(note, active) => {
        updateSelected(note, active);
      }}
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
      onClick={() => {
        synth.triggerAttackRelease(props.note, "8n");
        props.updateSelected(props.note, !active);
        setActive(!active);
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
