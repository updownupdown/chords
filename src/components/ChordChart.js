import React from "react";
import { chordList } from "./Lists";
import { Picker } from "./Picker";
import { notesWithIntervals, trimChordRoot } from "./Utils";
import Sound from "../icons/sound";
import Piano from "../icons/piano";
import Clear from "../icons/clear";
import "../css/charts.scss";
import "../css/chords.scss";

export const ChordChart = (props) => {
  const octave = ["C", "D", "E", "F", "G", "A", "B"];

  const noteChoices = octave.map((note, i) => (
    <span key={i} className="note">
      <button
        className="natural"
        onClick={() => {
          props.getChord(`${note}${props.myChord.formula}`);
        }}
      >
        {note}
      </button>
      <button
        className="flat"
        onClick={() => {
          props.getChord(`${note}b${props.myChord.formula}`);
        }}
      >
        {note}b
      </button>
      <button
        className="sharp"
        onClick={() => {
          props.getChord(`${note}#${props.myChord.formula}`);
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
                    props.getChord(`${props.myChord.root}${chord.formula}`);
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

  // Format Chord Type
  function formatChordName(type) {
    const formattedType = replaceAll(type, chordStringSubs);
    return formattedType;
  }

  function replaceAll(str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");

    return str.replace(re, function (matched) {
      return mapObj[matched.toLowerCase()];
    });
  }

  const chordStringSubs = {
    second: "2nd",
    third: "3rd",
    fourth: "4th",
    fifth: "5th",
    sixth: "6th",
    seventh: "7th",
    eight: "8th",
    ninth: "9th",
    eleventh: "11th",
    twelfth: "12th",
    thirteenth: "13th",
  };

  return (
    <div className="chart">
      <div className="chart-title">
        <div className="picker-group theme-chord">
          <Picker className="picker-notes" selected={props.myChord.root}>
            <div className="picker-notes-menu">{noteChoices}</div>
          </Picker>
          <Picker
            className="picker-chords"
            selected={
              // chord.type has nicer format than formula, use if possible
              props.myChord.chord.type
                ? formatChordName(props.myChord.chord.type)
                : formatChordName(props.myChord.formula)
            }
          >
            <div className="picker-chords-menu">{chordChoices}</div>
          </Picker>
        </div>

        <div className="button-group touching">
          <button
            className="outline"
            onClick={() => {
              props.getChord(`${props.myChord.root}${props.myChord.formula}`);
            }}
            disabled={
              props.autoplaying ||
              props.pianoLocked ||
              (props.notesSelected.type === "chord" &&
                Object.keys(props.myChord.chord).length !== 0)
            }
          >
            <Piano />
            <span className="text">Select</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.playChord();
            }}
            disabled={
              props.autoplaying || Object.keys(props.myChord.chord).length === 0
            }
          >
            <Sound />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.hideChord();
            }}
            disabled={
              !props.showChord ||
              props.autoplaying ||
              Object.keys(props.myChord.chord).length === 0
            }
          >
            <Clear />
          </button>
        </div>
      </div>

      <div className="chart-details">
        {!props.showChord || Object.keys(props.myChord.chord).length === 0 ? (
          <span className="no-selection">No chord selected.</span>
        ) : (
          <div className="chord-details">
            {notesWithIntervals(
              props.myChord.chord["notes"],
              props.myChord.chord["intervals"]
            )}

            <div className="chart-details-footer">
              <div className="chord-name">
                <span className="name">
                  {formatChordName(props.myChord.chord.name)}
                </span>
                <span className="divider">/</span>
                <span className="aliases">
                  {props.myChord.chord["aliases"].map((alias, i) => {
                    if (alias === "") return "";
                    var formatted = i !== 0 ? ", " : "";
                    formatted += props.myChord.chord["notes"][0] + alias;
                    return formatted;
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chart-select chart-select-bottom">
        <span className="chart-select-label">Chords from selected notes:</span>
        <div>
          {props.chordDetect.length > 0 ? (
            <div className="button-group">
              {props.chordDetect.map((chord, i) => (
                <button
                  key={i}
                  className="button small theme-chord"
                  onClick={() => {
                    props.getChord(trimChordRoot(chord));
                  }}
                  disabled={
                    trimChordRoot(chord) ===
                    `${props.myChord.root}${props.myChord.formula}`
                  }
                >
                  {trimChordRoot(chord)}
                </button>
              ))}
            </div>
          ) : (
            <span className="chart-select-text empty">No chords detected.</span>
          )}
        </div>
      </div>
    </div>
  );
};
