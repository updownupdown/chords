import React, { useState } from "react";
import { chordNotes, chordList } from "./Lists";
import Sound from "../icons/sound";
import "../css/charts.scss";
import "../css/chords.scss";

export const ChordChart = (props) => {
  const [pickNote, setPickNote] = useState(
    chordNotes[Object.keys(chordNotes)[0]]
  );
  const [pickType, setPickType] = useState(chordList[0].value);
  const [pickTypeIndex, setPickTypeIndex] = useState(0);
  const [pickChord, setPickChord] = useState(chordList[0].options[0].value);

  function trimChordRoot(name) {
    const chordName = name.split("/");
    return chordName[0];
  }

  function getChordList(index) {
    const chords = chordList[index].options;

    return chords.map((chordType, i) => (
      <option key={i} value={chordType.value}>
        {chordType.name}
      </option>
    ));
  }

  // useEffect(() => {
  //   getChord(`${pickNote}${pickChord}`);
  // }, [pickNote, pickType, pickChord]);

  return (
    <div className="chart">
      <div className="chart-select chord-picker">
        <div className="select-group">
          <select
            className="chord-note"
            onChange={(e) => {
              setPickNote(e.target.value);
            }}
            value={pickNote}
          >
            {Object.entries(chordNotes).map(([note, equiv], i) => (
              <option key={i} value={note}>
                {note}
              </option>
            ))}
          </select>

          <select
            className="chord-type"
            onChange={(e) => {
              setPickType(e.target.value);
              setPickTypeIndex(e.target.selectedIndex);
              setPickChord(chordList[e.target.selectedIndex].options[0].value);
            }}
            value={pickType}
          >
            {chordList.map((chordType, i) => (
              <option key={i} value={chordType.value}>
                {chordType.name}
              </option>
            ))}
          </select>

          <select
            className="chord-chord"
            onChange={(e) => {
              setPickChord(e.target.value);
            }}
            value={pickChord}
          >
            {getChordList(pickTypeIndex)}
          </select>
        </div>

        <span className="radio-group">
          <div className="radio-group">
            <div
              className={`radio-item ${
                props.chosenChord.name === pickNote + pickChord && "checked"
              }`}
            >
              <input
                type="radio"
                id={`chord-radio-${pickNote}-${pickChord}`}
                name="chord-radio"
                value={`${pickNote}${pickChord}`}
                checked={props.chosenChord.name === pickNote + pickChord}
                onChange={(e) => {
                  props.getChord(e.currentTarget.value);
                }}
              />
              <label htmlFor={`chord-radio-${pickNote}-${pickChord}`}>
                {pickNote}
                {pickChord}
              </label>
            </div>
          </div>
        </span>
      </div>
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
                    props.chosenChord.name === trimChordRoot(chord) && "checked"
                  }`}
                  key={i}
                >
                  <input
                    type="radio"
                    id={`chord-radio-${trimChordRoot(chord)}`}
                    name="chord-radio"
                    value={trimChordRoot(chord)}
                    checked={props.chosenChord === trimChordRoot(chord)}
                    onChange={(e) => {
                      props.getChord(e.currentTarget.value);
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
          {Object.keys(props.chosenChord.chord).length === 0 ? (
            <span className="empty">Chord</span>
          ) : (
            <span className="color-theme-chord">
              {props.chosenChord.chord.symbol}
            </span>
          )}
        </span>

        <div className="button-group touching">
          <button
            className="outline theme-chord play-chord"
            onClick={() => {
              props.playChord();
            }}
            disabled={
              props.autoplaying ||
              Object.keys(props.chosenChord.chord).length === 0
            }
          >
            <Sound />
          </button>
          <button
            className="outline theme-chord select-chord"
            onClick={() => {
              if (Object.keys(props.chosenChord.chord).length !== 0) {
                props.selectChordNotes(props.chosenChord.chord);
              }
            }}
            disabled={
              props.autoplaying ||
              props.keyboardLocked ||
              Object.keys(props.chosenChord.chord).length === 0
            }
          >
            <span className="text">Select</span>
          </button>
        </div>
      </div>

      <div className="chart-details">
        {Object.keys(props.chosenChord.chord).length === 0 ? (
          <span className="empty">No chord info to show.</span>
        ) : (
          chordInfo(props.chosenChord.chord)
        )}
      </div>
    </div>
  );
};

const intQuality = {
  P: "Perfect",
  M: "Major",
  m: "Minor",
  d: "Diminished",
  A: "Augmented",
};

const intNumber = {
  "1": "unison",
  "2": "second",
  "3": "third",
  "4": "fourth",
  "5": "fifth",
  "6": "sixth",
  "7": "seventh",
  "8": "octave",
  "9": "ninth",
  "10": "tenth",
  "11": "eleventh",
  "12": "twelfth",
  "13": "thirteenth",
  "14": "fourteenth",
  "15": "fifteenth",
};

function intervalName(interval) {
  if (interval === "1P") return "Perfect unison";

  const quality = interval.charAt(1);
  const number = interval.charAt(0);

  return intQuality[quality] + " " + intNumber[number];
}

function chordInfo(chord) {
  return (
    <div className="chord-details">
      <div className="chord-name">
        <span className="name">{chord.name}</span>
        <span className="aliases">Aliases: {chord["aliases"].join(", ")}</span>
      </div>
      <span className="chord-notes">
        {chord["notes"].length === chord["intervals"].length &&
          chord["notes"].map((note, i) => (
            <span key={i} className="pair">
              <span
                className="interval"
                title={intervalName(chord["intervals"][i])}
              >
                {chord["intervals"][i]}
              </span>
              <span className="note">{note}</span>
            </span>
          ))}
      </span>
    </div>
  );
}
