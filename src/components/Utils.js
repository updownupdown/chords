import React from "react";
import { Note, Interval } from "@tonaljs/tonal";

export function sortAlpha(a, b) {
  if (a > b) return 1;
  if (b > a) return -1;

  return 0;
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

// Get pitched notes from chord
export function pitchedNotesFromChord(notes) {
  var pitch = 4;
  var pitched = [];

  const octave = ["C", "D", "E", "F", "G", "A", "B"];
  var oldIndex = 0;

  for (var i = 0; i < notes.length; i++) {
    // increment after octave increases
    var newIndex = octave.indexOf(notes[i].charAt(0));
    if (newIndex < oldIndex) pitch++;
    oldIndex = newIndex;

    const simplified = notes[i].length > 2 ? Note.simplify(notes[i]) : notes[i];

    // need to simplify notes to get rid of things like "Bbb"
    pitched.push(simplified + pitch.toString());
  }

  return pitched;
}

// Get pitched notes from key/type
export function pitchedNotesFromKey(key, type, subtype) {
  var pitch = 4;
  var scale = type === "major" ? key.scale : key[subtype].scale;
  var pitched = [];

  for (var i = 0; i < scale.length; i++) {
    pitched.push(scale[i] + pitch.toString());

    if (scale[i].includes("B")) {
      pitch++;
    }
  }
  pitched.push(scale[0] + pitch.toString());

  return pitched;
}

export function notesWithIntervals(notes, absIntervals) {
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
              {note.intRoot.charAt(1)}
              {note.intRoot.charAt(0)}
            </span>
            <span className="note">{note.note}</span>
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
    </span>
  );
}
