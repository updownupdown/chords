import React, { useState } from "react";
import { Chord } from "@tonaljs/tonal";
import "../css/chords.scss";

export const Chords = (props) => {
  const [chosenChord, setChosenChord] = useState(false);

  function chordInfo(chord) {
    const details = Chord.get(chord);

    const infos = [
      {
        label: "Full Name",
        info: "name",
      },
      {
        label: "Symbol",
        info: "symbol",
      },
      {
        label: "Tonic",
        info: "tonic",
      },
      // {
      //   label: "Root",
      //   info: "root",
      // },
      // {
      //   label: "Root Degree",
      //   info: "rootDegree",
      // },
      // {
      //   label: "setNum",
      //   info: "setNum",
      // },
      // {
      //   label: "Type",
      //   info: "type",
      // },
      {
        label: "Aliases",
        info: "aliases",
        object: true,
      },
      // {
      //   label: "Chroma",
      //   info: "chroma",
      // },
      // {
      //   label: "Intervals",
      //   info: "intervals",
      //   object: true,
      // },
      // {
      //   label: "Normalized",
      //   info: "normalized",
      // },
      // {
      //   label: "Notes",
      //   info: "notes",
      //   object: true,
      // },
      // {
      //   label: "Quality",
      //   info: "quality",
      // },
    ];

    return (
      <div className="chords-info-details">
        {infos.map((info, i) => (
          <span key={i}>
            <span className="label">{info.label}: </span>
            <span className="value">
              {info.object === true
                ? details[info.info].join(", ")
                : details[info.info]}
            </span>
          </span>
        ))}
        {/* <span>Full Name: {details.name}</span>
        <br />
        <span>Tonic: {details.tonic}</span>
        <br />
        <span>Quality: {details.quality}</span>
        <br /> */}
      </div>
    );
  }

  return (
    <div className="chords">
      <div className="chords-predictions">
        <span className="chords-predictions-list-label">Predicted chords:</span>
        <span
          className={`chords-predictions-list ${
            props.chordDetect.length > 0 ? "not-empty" : "empty"
          }`}
        >
          {props.chordDetect.length > 0
            ? props.chordDetect.map((chord, i) => (
                <span
                  className={`chords-predictions-list-item ${
                    chosenChord === chord && "checked"
                  }`}
                  key={i}
                >
                  <input
                    type="radio"
                    id={`chord-radio-${chord}`}
                    name="chord-radio"
                    value={chord}
                    checked={chosenChord === chord}
                    onChange={(e) => {
                      setChosenChord(e.currentTarget.value);
                    }}
                  />
                  <label htmlFor={`chord-radio-${chord}`}>{chord}</label>
                </span>
              ))
            : "no chords detected..."}
        </span>
      </div>
      <div className="chords-info">
        {chosenChord ? (
          chordInfo(chosenChord)
        ) : (
          <span className="chords-info-empty">Please select a chord...</span>
        )}
      </div>
    </div>
  );
};
