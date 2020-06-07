import React, { useState, useEffect, useRef } from "react";
import { Chord } from "@tonaljs/tonal";
import { chordNotes, chordList } from "./Lists";
import Sound from "../icons/sound";
import "../css/charts.scss";
import "../css/chords.scss";

export const ChordChart = (props) => {
  const [pickNote, setPickNote] = useState(chordNotes[0]);
  const [pickType, setPickType] = useState(chordList[0].value);
  const [pickTypeIndex, setPickTypeIndex] = useState(0);
  const [pickChord, setPickChord] = useState(chordList[0].options[0].value);

  function trimChordRoot(name) {
    const chordName = name.split("/");
    return chordName[0];
  }

  function getChord(name) {
    const chord = Chord.get(name);

    if (chord.empty) return;

    props.selectChord(chord, name);
  }

  function getChordList(index) {
    const chords = chordList[index].options;

    return chords.map((chordType, i) => (
      <option key={i} value={chordType.value}>
        {chordType.name}
      </option>
    ));
  }

  useEffect(() => {
    getChord(`${pickNote}${pickChord}`);
  }, [pickNote, pickType, pickChord]);

  return (
    <div className="chart">
      <div className="chart-select chord-picker">
        <span className="chart-select-label">Chord Picker:</span>
        <div className="select-group">
          <select
            className="chord-note"
            onChange={(e) => {
              setPickNote(e.target.value);
            }}
            value={pickNote}
          >
            {chordNotes.map((note, i) => (
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
          {Object.keys(props.chosenChord.chord).length === 0 ? (
            <span className="empty">No chord selected...</span>
          ) : (
            <span>{props.chosenChord.chord.name}</span>
          )}
        </span>

        <div className="button-group touching">
          <button
            className="outline play-chord"
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
            className="outline select-chord"
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

function chordInfo(chord) {
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
      label: "Aliases",
      info: "aliases",
      object: true,
    },
    {
      label: "Chroma",
      info: "chroma",
    },
    {
      label: "Intervals",
      info: "intervals",
      object: true,
    },
    {
      label: "Notes",
      info: "notes",
      object: true,
    },
  ];

  return (
    <>
      {infos.map((info, i) => (
        <div key={i} className="detail">
          <span className="label">{info.label}: </span>
          <span className="value">
            {info.object === true
              ? chord[info.info].join(", ")
              : chord[info.info]}
          </span>
        </div>
      ))}
    </>
  );
}
