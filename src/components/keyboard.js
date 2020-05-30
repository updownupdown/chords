import React, { useState } from "react";
import * as Tone from "tone";
import classNames from "classnames";

const synth = new Tone.Synth({
  oscillator: {
    type: "sine",
    modulationFrequency: 2,
  },
  // envelope: {
  //   attack: 0.02,
  //   decay: 0.1,
  //   sustain: 0.2,
  //   release: 0.9,
  // },
});

synth.volume.value = -10;

synth.toMaster();

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

const keyList = keys.map((key) => (
  <Key
    key={key.note}
    color={key.color}
    label={key.label}
    note={`${key.note}4`}
    active={false}
  />
));

function Keyboard() {
  return <div className="kb">{keyList}</div>;
}

function Key(props) {
  const [active, setActive] = useState(false);

  return (
    <button
      className={classNames(`key key-${props.color}`, {
        active: active,
      })}
      onMouseDown={() => {
        synth.triggerAttackRelease(props.note, "8n");
        setActive(!active);
      }}
    >
      <div className="key-label">{props.label}</div>
    </button>
  );
}

export default Keyboard;
