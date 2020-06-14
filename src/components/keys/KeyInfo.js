// Key info
import React from "react";
import { Key } from "@tonaljs/tonal";
import { NotesIntervals } from "../common/NotesIntervals";
import { gradesNumerals } from "../../utils/Lists";
import classNames from "classnames";

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

export const KeyInfo = (props) => {
  // Chords with grades
  function chordsWithGrades(type, chords, harmonicFunction) {
    return (
      <div className="chords-with-grades">
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
      </div>
    );
  }

  var keyDetails = {};
  var details = {};

  if (props.myKey.type === "major") {
    details = Key.majorKey(props.myKey.root);

    keyDetails = {
      notes: details["scale"],
      intervals: details["intervals"],
      chords: details["chords"],
      harmonics: details["chordsHarmonicFunction"],
      subtype: "major",
    };
  } else if (props.myKey.type === "minor") {
    details = Key.minorKey(props.myKey.root);

    keyDetails = {
      notes: details[props.myKey.subtype]["scale"],
      intervals: details[props.myKey.subtype]["intervals"],
      chords: details[props.myKey.subtype]["chords"],
      harmonics: details[props.myKey.subtype]["chordsHarmonicFunction"],
      subtype: props.myKey.subtype,
    };
  }

  return (
    <>
      <NotesIntervals
        playPiano={props.playPiano}
        notes={keyDetails.notes}
        intervals={keyDetails.intervals}
      />
      {chordsWithGrades(
        keyDetails.subtype,
        keyDetails.chords,
        keyDetails.harmonics
      )}
    </>
  );
};
