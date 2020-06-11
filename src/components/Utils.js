import React from "react";
import { Interval } from "@tonaljs/tonal";

export function sortAlpha(a, b) {
  if (a > b) return 1;
  if (b > a) return -1;

  return 0;
}

export const gradesNumerals = {
  major: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
  natural: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
  harmonic: ["i", "ii°", "III+", "iv", "V", "VI", "vii°"],
  melodic: ["i", "ii", "III+", "IV", "V", "vi°", "vii°"],
};

export const gradesOrder = {
  major: [
    { grade: "I", type: "major" },
    { grade: "V", type: "major" },
    { grade: "ii", type: "minor" },
    { grade: "vi", type: "minor" },
    { grade: "iii", type: "minor" },
    { grade: "vii°", type: "diminished" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "IV", type: "major" },
  ],
  natural: [
    { grade: "i", type: "minor" },
    { grade: "v", type: "minor" },
    { grade: "ii°", type: "diminished" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "VI", type: "major" },
    { grade: "III", type: "major" },
    { grade: "VII", type: "major" },
    { grade: "iv", type: "minor" },
  ],
  harmonic: [
    { grade: "i", type: "minor" },
    { grade: "V", type: "major" },
    { grade: "ii°", type: "diminished" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "vii°", type: "diminished" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "VI", type: "major" },
    { grade: "III+", type: "augmented" },
    { grade: "", type: "none" },
    { grade: "iv", type: "minor" },
  ],
  melodic: [
    { grade: "i", type: "minor" },
    { grade: "V", type: "major" },
    { grade: "ii", type: "minor" },
    { grade: "vi°", type: "diminished" },
    { grade: "", type: "none" },
    { grade: "vii°", type: "diminished" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "", type: "none" },
    { grade: "III+", type: "augmented" },
    { grade: "", type: "none" },
    { grade: "IV", type: "major" },
  ],
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

export function trimChordRoot(name) {
  const chordName = name.split("/");
  return chordName[0];
}

export function getChordRoot(name) {
  const chordName = name.split("/");
  return chordName[1];
}

export function getRootAndFormula(chord) {
  const root = chord.root ? chord.root : chord.notes[0];
  const formula = trimChordRoot(chord.symbol).substring(root.length);

  return { root: root, formula: formula };
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
