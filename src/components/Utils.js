import React from "react";
import { Interval } from "@tonaljs/tonal";

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

export function trimChordRoot(name) {
  const chordName = name.split("/");
  return chordName[0];
}

export function getChordRoot(name) {
  const chordName = name.split("/");
  return chordName[1];
}

export function notesWithIntervals(notes, absIntervals) {
  var notesList = [];

  if (notes.length === absIntervals.length) {
    for (var i = 0; i < notes.length; i++) {
      const note = notes[i];
      const intRoot = absIntervals[i];
      const intRelative =
        i === notes.length ? "" : Interval.distance(notes[i], notes[i + 1]);

      notesList.push({
        note: note,
        intRoot: intRoot,
        intRelative: intRelative,
      });
    }
  }

  return (
    <span className="notes-with-intervals">
      {notesList.map((note, i) => (
        <span key={i} className="pair">
          <div className="note-root">
            <span className="root-interval" title={intervalName(note.intRoot)}>
              {note.intRoot}
            </span>
            <span className="note">{note.note}</span>
          </div>
          <span
            className="relative-interval"
            title={intervalName(note.intRelative)}
          >
            {note.intRelative}
          </span>
        </span>
      ))}
    </span>
  );
}
