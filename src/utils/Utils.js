import { Note } from "@tonaljs/tonal";
import { highestNoteMidi } from "./Lists";

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
export function pitchedNotes(notes, lower) {
  const octave = ["C", "D", "E", "F", "G", "A", "B"];

  var pitch = lower ? 3 : 4;
  var pitched = [];
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

  // see if chord will fit start on octave 4, otherwise start at 3
  // also prevent going through function thrice
  if (!lower && Note.midi(pitched[notes.length - 1]) > highestNoteMidi) {
    return pitchedNotes(notes, true);
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

  // repeat first note, one octave higher
  pitched.push(scale[0] + pitch.toString());

  return pitched;
}
