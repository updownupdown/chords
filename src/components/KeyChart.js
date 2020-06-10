import React, { useState, useEffect, useRef } from "react";
import { Key } from "@tonaljs/tonal";
import { notesWithIntervals } from "./Utils";
import { Picker } from "./Picker";
import Sound from "../icons/sound";
import Piano from "../icons/piano";
import Clear from "../icons/clear";
import "../css/charts.scss";
import "../css/keys.scss";

export const KeyChart = (props) => {
  const gradesNumerals = {
    major: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
    natural: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
    harmonic: ["i", "ii°", "III+", "iv", "V", "VI", "vii°"],
    melodic: ["i", "ii", "III+", "IV", "V", "vi°", "vii°"],
  };

  const harmonicName = {
    T: "Tonic",
    SD: "Sub Dom.",
    D: "Dominant",
    "-": "-",
  };

  function harmonicLabel(harmonic) {
    const string = harmonic.substr(1).replace("b", "").replace("#", "");
    return harmonicName[string];
  }

  // Chords with grades
  function chordsWithGrades(type, chords, harmonicFunction) {
    return (
      <span className="chords-with-grades">
        {chords.map((chord, i) => (
          <div key={i} className="pair">
            <span className="grade">{gradesNumerals[type][i]}</span>
            <button
              className="small theme-chord"
              onClick={() => {
                props.getChord(chord);
              }}
            >
              {chord}
            </button>
            <span className="harmonic-function">
              {harmonicLabel(harmonicFunction[i])}
            </span>
          </div>
        ))}
      </span>
    );
  }

  function relativeKey(relative, type) {
    return (
      <div className="detail">
        <span className="label">Relative Key</span>
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
          {relativeKey(details["minorRelative"], "minor")}
          {notesWithIntervals(details["scale"], details["intervals"])}
          {chordsWithGrades(
            "major",
            details["chords"],
            details["chordsHarmonicFunction"]
          )}
        </>
      );
    } else if (props.myKey.type === "minor") {
      const details = Key.minorKey(props.myKey.root);

      return (
        <>
          {relativeKey(details["relativeMajor"], "major")}
          {notesWithIntervals(
            details[props.myKey.subtype]["scale"],
            details[props.myKey.subtype]["intervals"]
          )}
          {chordsWithGrades(
            props.myKey.subtype,
            details[props.myKey.subtype]["chords"],
            details[props.myKey.subtype]["chordsHarmonicFunction"]
          )}
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
              (props.notesSelected.type === "key" &&
                Object.keys(props.myKey.key).length !== 0)
            }
          >
            <Piano />
            <span className="text">Select</span>
          </button>
          <button
            className="outline"
            onClick={
              Object.keys(props.myKey.key).length !== 0 ? props.playScale : null
            }
            disabled={
              props.autoplaying || Object.keys(props.myKey.key).length === 0
            }
          >
            <Sound />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.hideKey();
            }}
            disabled={
              props.autoplaying || Object.keys(props.myKey.key).length === 0
            }
          >
            <Clear />
          </button>
        </div>
      </div>

      <div className="chart-details">
        {!props.showKey || Object.keys(props.myKey.key).length === 0 ? (
          <span className="empty">No key selected.</span>
        ) : (
          props.myKey.root && keyInfo()
        )}
      </div>
    </div>
  );
};
