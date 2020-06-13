import React from "react";
import { chordList } from "../../utils/Lists";
import { Picker } from "../common/Picker";
import { trimChordRoot } from "../../utils/Utils";
import { NotesIntervals } from "../common/NotesIntervals";
import Sound from "../../icons/sound";
import Piano from "../../icons/piano";
import "../../css/boxes.scss";
import "./chords.scss";

export const Chords = (props) => {
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
    function replaceAll(str, mapObj) {
      const replace = new RegExp(Object.keys(mapObj).join("|"), "gi");

      return str.replace(replace, function (matched) {
        return mapObj[matched.toLowerCase()];
      });
    }

    const formattedType = replaceAll(type, chordStringSubs);
    return formattedType;
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
    <div className="box">
      <div className="box-header">
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
              (props.selected.cat === "chord" &&
                Object.keys(props.myChord.chord).length !== 0)
            }
          >
            <Piano />
            <span className="text">Select</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.playPiano("chord", true);
            }}
            disabled={
              props.autoplaying || Object.keys(props.myChord.chord).length === 0
            }
          >
            <Sound />
            <span className="text">Play</span>
          </button>
        </div>
      </div>

      <div className="box-body">
        {Object.keys(props.myChord.chord).length === 0 ? (
          <span className="no-selection">No chord selected.</span>
        ) : (
          <>
            <NotesIntervals
              playPiano={props.playPiano}
              notes={props.myChord.chord["notes"]}
              intervals={props.myChord.chord["intervals"]}
            />

            <div className="chord-details-footer">
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

              <button
                className="small"
                onClick={() => {
                  props.setMyProg({ type: "add" });
                }}
              >
                Add to Chord Progression
              </button>
            </div>
          </>
        )}
      </div>

      <div className="box-footer">
        <span className="box-footer-label">Chords from selected notes:</span>
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
            <span className="box-select-text empty">No chords detected.</span>
          )}
        </div>
      </div>
    </div>
  );
};
