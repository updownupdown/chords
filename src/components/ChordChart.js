import React, { useState, useEffect, useRef } from "react";
import { chordList } from "./Lists";
import { Picker } from "./Picker";
import { notesWithIntervals } from "./Utils";
import Sound from "../icons/sound";
import Piano from "../icons/piano";
import Clear from "../icons/clear";
import "../css/charts.scss";
import "../css/chords.scss";

export const ChordChart = (props) => {
  const [chordNote, setChordNote] = useState("C");
  const [chordType, setChordType] = useState({ name: "Major", formula: "M" });

  function trimChordRoot(name) {
    const chordName = name.split("/");
    return chordName[0];
  }

  const manualChordSelection = useRef(false);

  useEffect(() => {
    if (!manualChordSelection.current) {
      manualChordSelection.current = true;
    } else {
      !props.keyboardLocked &&
        props.getChord(`${chordNote}${chordType.formula}`);
    }
  }, [chordNote, chordType]);

  const octave = ["C", "D", "E", "F", "G", "A", "B"];

  const noteChoices = octave.map((note, i) => (
    <span key={i} className="note">
      <button
        className="natural"
        onClick={() => {
          setChordNote(note);
        }}
      >
        {note}
      </button>
      <button
        className="flat"
        onClick={() => {
          setChordNote(note + "b");
        }}
      >
        {note}b
      </button>
      <button
        className="sharp"
        onClick={() => {
          setChordNote(note + "#");
        }}
      >
        {note}#
      </button>
    </span>
  ));

  const chordChoices = (
    <>
      {Object.keys(chordList).map((item, i) => (
        <span key={i} className="type-group">
          <span className="type-group-title">{chordList[item].name}</span>
          <span className="type-group-options">
            {chordList[item].options.map((chord, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                    setChordType({ name: chord.name, formula: chord.formula });
                  }}
                >
                  {chord.name}
                </button>
              );
            })}
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className="chart">
      <div className="chart-select  chart-select-top chord-picker">
        <div className="picker-group">
          <Picker className="picker-notes" selected={chordNote}>
            <div className="picker-notes-menu">{noteChoices}</div>
          </Picker>
          <Picker className="picker-chords" selected={chordType.name}>
            <div className="picker-chords-menu">{chordChoices}</div>
          </Picker>
        </div>

        <div className="radio-group">
          <div
            className={`radio-item ${
              props.chosenChord.name === chordNote + chordType.formula &&
              "checked"
            }`}
          >
            <input
              type="radio"
              id={`chord-radio-${chordNote}-${chordType.formula}`}
              name="chord-radio"
              value={`${chordNote}${chordType.formula}`}
              checked={props.chosenChord.name === chordNote + chordType.formula}
              onChange={(e) => {
                props.getChord(e.currentTarget.value);
              }}
            />
            <label htmlFor={`chord-radio-${chordNote}-${chordType.formula}`}>
              {chordNote}
              {chordType.formula}
            </label>
          </div>
        </div>
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
            className="outline theme-chord"
            onClick={() => {
              if (Object.keys(props.chosenChord.chord).length !== 0) {
                props.selectChordNotes(props.chosenChord.chord);
              }
            }}
            disabled={
              props.autoplaying ||
              props.keyboardLocked ||
              props.selNotesType === "chord" ||
              Object.keys(props.chosenChord.chord).length === 0
            }
          >
            <Piano />
            <span className="text">Select</span>
          </button>
          <button
            className="outline theme-chord"
            onClick={() => {
              props.playChord();
            }}
            disabled={
              props.autoplaying ||
              Object.keys(props.chosenChord.chord).length === 0
            }
          >
            <Sound />
            <span className="text">Play</span>
          </button>
          <button
            className="outline theme-chord"
            onClick={() => {
              props.getChord("");
            }}
            disabled={
              props.autoplaying ||
              Object.keys(props.chosenChord.chord).length === 0
            }
          >
            <Clear />
            <span className="text">Clear</span>
          </button>
        </div>
      </div>

      <div className="chart-details">
        {Object.keys(props.chosenChord.chord).length === 0 ? (
          <span className="empty">No chord selected.</span>
        ) : (
          chordInfo(props.chosenChord.chord)
        )}
      </div>

      <div className="chart-select chart-select-bottom">
        <span className="chart-select-label">Predicted chords:</span>
        <div>
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
        </div>
      </div>
    </div>
  );
};

function chordInfo(chord) {
  return (
    <div className="chord-details">
      <div className="chord-name">
        <span className="name">{chord.name}</span>
        <span className="aliases">
          {chord["aliases"].map((alias, i) => {
            if (alias === "") return;
            var formatted = i !== 0 ? ", " : "";
            formatted += chord["notes"][0] + alias;
            return formatted;
          })}
        </span>
      </div>

      {notesWithIntervals(chord["notes"], chord["intervals"])}
    </div>
  );
}
