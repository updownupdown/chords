import React from "react";
import { Key } from "@tonaljs/tonal";
import { NotesIntervals } from "./NotesIntervals";
import { gradesNumerals } from "./Lists";
import classNames from "classnames";
import { Picker } from "./Picker";
import Sound from "../icons/sound";
import Piano from "../icons/piano";
import "../css/charts.scss";
import "../css/keys.scss";

export const KeyChart = (props) => {
  const harmonicName = {
    T: "Tonic",
    SD: "Sub Dom.",
    D: "Dominant",
    "-": "-",
  };

  function gradeType(grade) {
    switch (grade.substr(-1)) {
      case "I":
      case "V":
        return "major";
      case "i":
      case "v":
        return "minor";
      case "°":
        return "diminished";
      case "+":
        return "augmented";
      default:
        return "";
    }
  }

  function harmonicLabel(harmonic) {
    const string = harmonic.substr(1).replace("b", "").replace("#", "");
    return harmonicName[string];
  }

  // Chords with grades
  function chordsWithGrades(type, chords, harmonicFunction) {
    return (
      <span className="chords-with-grades">
        {chords.map((chord, i) => {
          const currentChord =
            chord === props.myChord.root + props.myChord.formula;

          return (
            <span
              key={i}
              role="button"
              className={classNames(
                `pair pair-${gradeType(gradesNumerals[type][i])}`,
                {
                  current: currentChord,
                }
              )}
              onClick={() => {
                currentChord
                  ? props.playPiano("chord", true)
                  : props.getChord(chord);
              }}
            >
              <span className="grade">{gradesNumerals[type][i]}</span>
              <span className="chord">{chord}</span>
              <span className="harmonic-function">
                {harmonicLabel(harmonicFunction[i])}
              </span>
            </span>
          );
        })}
      </span>
    );
  }

  function relativeKey(relative, type) {
    return (
      <div className="relative-key">
        <span className="label">Relative Key:</span>
        <span className="value">
          <button
            className="small theme-key"
            onClick={() => {
              props.getKey(relative, type, type === "major" ? "" : "natural");
            }}
          >
            {`${relative} ${type}`}
          </button>
        </span>
      </div>
    );
  }

  // Key info
  function keyInfo() {
    if (props.myKey.type === "major") {
      const details = Key.majorKey(props.myKey.root);

      return (
        <>
          <NotesIntervals
            playPiano={props.playPiano}
            notes={details["scale"]}
            intervals={details["intervals"]}
          />
          {chordsWithGrades(
            "major",
            details["chords"],
            details["chordsHarmonicFunction"]
          )}
          <div className="chart-details-footer">
            {relativeKey(details["minorRelative"], "minor")}
          </div>
        </>
      );
    } else if (props.myKey.type === "minor") {
      const details = Key.minorKey(props.myKey.root);

      return (
        <>
          <NotesIntervals
            playPiano={props.playPiano}
            notes={details[props.myKey.subtype]["scale"]}
            intervals={details[props.myKey.subtype]["intervals"]}
          />
          {chordsWithGrades(
            props.myKey.subtype,
            details[props.myKey.subtype]["chords"],
            details[props.myKey.subtype]["chordsHarmonicFunction"]
          )}
          <div className="chart-details-footer">
            {relativeKey(details["relativeMajor"], "major")}
          </div>
        </>
      );
    }

    return;
  }

  const octave = ["C", "D", "E", "F", "G", "A", "B"];

  const noteChoices = octave.map((note, i) => (
    <span key={i} className="note">
      <button
        className="natural"
        onClick={() => {
          props.getKey(note, props.myKey.type, props.myKey.subtype);
        }}
        disabled={props.myKey.root === note}
      >
        {note}
      </button>
      <button
        className="flat"
        onClick={() => {
          props.getKey(note + "b", props.myKey.type, props.myKey.subtype);
        }}
        disabled={props.myKey.root === note + "b"}
      >
        {note}b
      </button>
      <button
        className="sharp"
        onClick={() => {
          props.getKey(note + "#", props.myKey.type, props.myKey.subtype);
        }}
        disabled={props.myKey.root === note + "#"}
      >
        {note}#
      </button>
    </span>
  ));

  const keyChoices = (
    <>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "major", "");
        }}
        disabled={props.myKey.type === "major"}
      >
        Major
      </button>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "minor", "natural");
        }}
        disabled={
          props.myKey.type === "minor" && props.myKey.subtype === "natural"
        }
      >
        Minor Natural
      </button>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "minor", "harmonic");
        }}
        disabled={
          props.myKey.type === "minor" && props.myKey.subtype === "harmonic"
        }
      >
        Minor Harmonic
      </button>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "minor", "melodic");
        }}
        disabled={
          props.myKey.type === "minor" && props.myKey.subtype === "melodic"
        }
      >
        Minor Melodic
      </button>
    </>
  );

  return (
    <div className="chart chart-key">
      <div className="chart-title">
        <div className="picker-group theme-key">
          <Picker className="picker-notes" selected={props.myKey.root}>
            <div className="picker-notes-menu">{noteChoices}</div>
          </Picker>
          <Picker
            className="picker-keys"
            selected={`${props.myKey.type} ${
              props.myKey.subtype ? props.myKey.subtype : ""
            }`}
          >
            <div className="picker-keys-menu">{keyChoices}</div>
          </Picker>
        </div>

        <div className="button-group touching">
          <button
            className="outline select-key"
            onClick={() => {
              props.getKey(
                props.myKey.root,
                props.myKey.type,
                props.myKey.subtype
              );
            }}
            disabled={
              props.autoplaying ||
              props.pianoLocked ||
              (props.selected.cat === "key" &&
                Object.keys(props.myKey.key).length !== 0)
            }
          >
            <Piano />
            <span className="text">Select</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.playPiano("scale", false);
            }}
            disabled={
              props.autoplaying || Object.keys(props.myKey.key).length === 0
            }
          >
            <Sound />
            <span className="text">Play</span>
          </button>
        </div>
      </div>

      <div className="chart-details">
        {Object.keys(props.myKey.key).length === 0 ? (
          <span className="no-selection">No key selected.</span>
        ) : (
          props.myKey.root && keyInfo()
        )}
      </div>
    </div>
  );
};
