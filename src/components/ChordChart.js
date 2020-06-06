import React, { useState } from "react";
import { Chord } from "@tonaljs/tonal";
import "../css/charts.scss";

export const ChordChart = (props) => {
  const [chosenChord, setChosenChord] = useState({ chord: {}, name: "" });

  function trimChordRoot(name) {
    const chordName = name.split("/");
    return chordName[0];
  }

  function getChord(name) {
    const chord = Chord.get(name);

    if (chord.empty === true) return;

    setChosenChord({ chord: chord, name: name });
  }

  function chordInfo(chord) {
    const details = chosenChord.chord;

    // console.log(chosenChord);

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
      {
        label: "Root",
        info: "root",
      },
      {
        label: "Root Degree",
        info: "rootDegree",
      },
      {
        label: "setNum",
        info: "setNum",
      },
      {
        label: "Type",
        info: "type",
      },
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
      <>
        {infos.map((info, i) => (
          <div key={i} className="detail">
            <span className="label">{info.label}: </span>
            <span className="value">
              {info.object === true
                ? details[info.info].join(", ")
                : details[info.info]}
            </span>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="chart">
      <div className="chart-select chord-predictions">
        <span className="chart-select-label">Predicted chords:</span>
        <span
          className={`radio-group ${
            props.chordDetect.length > 0 ? "not-empty" : "empty"
          }`}
        >
          {props.chordDetect.length > 0 ? (
            <div className="radio-group">
              {props.chordDetect.map((chord, i) => (
                <div
                  className={`radio-item ${
                    chosenChord.name === trimChordRoot(chord) && "checked"
                  }`}
                  key={i}
                >
                  <input
                    type="radio"
                    id={`chord-radio-${trimChordRoot(chord)}`}
                    name="chord-radio"
                    value={trimChordRoot(chord)}
                    checked={chosenChord === trimChordRoot(chord)}
                    onChange={(e) => {
                      getChord(e.currentTarget.value);
                    }}
                  />
                  <label htmlFor={`chord-radio-${trimChordRoot(chord)}`}>
                    {trimChordRoot(chord)}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <span className="chart-select-text empty">
              Select notes to detect chords.
            </span>
          )}
        </span>
      </div>

      <div className="chart-title">
        <span className="chart-title-label">
          {Object.keys(chosenChord.chord).length === 0 ? (
            <span className="empty">No chord selected...</span>
          ) : (
            <span>{chosenChord.name}</span>
          )}
        </span>

        <div className="button-group touching">
          <button className="outline" disabled>
            <span className="text">Select</span>
          </button>
        </div>
      </div>

      <div className="chart-details">
        {Object.keys(chosenChord.chord).length === 0 ? (
          <span className="empty">No chord info to show.</span>
        ) : (
          chordInfo()
        )}
      </div>
    </div>
  );
};
