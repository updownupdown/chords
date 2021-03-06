import React from "react";
import { Interval } from "@tonaljs/tonal";
import { pitchedNotes, stylizeNote } from "../../utils/Utils";
import "./notes-intervals.scss";

export function NotesIntervals(props) {
  function intervalName(interval) {
    if (interval === "1P") return "Perfect unison";

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

    const quality = interval.charAt(1);
    const number = interval.charAt(0);

    return intQuality[quality] + " " + intNumber[number];
  }

  var notesList = [];
  const pitched = pitchedNotes(props.notes);

  if (props.notes.length === props.intervals.length) {
    for (var i = 0; i < props.notes.length; i++) {
      const note = props.notes[i];
      const intRoot = props.intervals[i];
      const intRelative =
        i === props.notes.length
          ? ""
          : Interval.distance(props.notes[i], props.notes[i + 1]);

      notesList.push({
        note: note,
        intRoot: intRoot,
        intRelative: intRelative,
      });
    }
  }

  return (
    <div className="notes-with-intervals">
      {notesList.map((note, i) => (
        <span key={i} className="pair">
          <div className="note-root">
            <span className="root-interval" title={intervalName(note.intRoot)}>
              {note.intRoot.charAt(1)}
              {note.intRoot.charAt(0)}
            </span>
            <span
              className="note"
              role="button"
              onClick={() => {
                props.playPiano("note", false, pitched[i]);
              }}
            >
              {stylizeNote(note.note)}
            </span>
          </div>
          <span
            className="relative-interval"
            title={intervalName(note.intRelative)}
          >
            {note.intRelative.charAt(1)}
            {note.intRelative.charAt(0)}
          </span>
        </span>
      ))}
    </div>
  );
}
