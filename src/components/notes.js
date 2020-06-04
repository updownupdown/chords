import { KeyboardMap } from "./KeyboardMap";
import { Note } from "@tonaljs/tonal";

let list = [];
var index = 0;
const octave = ["C", "D", "E", "F", "G", "A", "B"];
const octaveLength = octave.length;
const pitchStart = 2;
var pitch = pitchStart;
const octaves = 3;

function hasSharp(note) {
  if (note !== "E" && note !== "B") {
    return true;
  }
  return false;
}

function addKey(letter, sharp) {
  var note = letter + (sharp ? "#" : "") + pitch.toString();
  var label = letter + (sharp ? "#" : "");

  var key = {
    index: index,
    color: sharp ? "black" : "white",
    label: label,
    note: note,
    pitch: pitch,
    midi: Note.midi(note),
  };

  // Keyboard shortcut?
  var shortcutIndex = Object.values(KeyboardMap).indexOf(note);
  if (shortcutIndex > -1) {
    key.shortcut = Object.keys(KeyboardMap)[shortcutIndex];
  }

  list.push(key);

  index++;
}

function generateKeys() {
  // Loop through keys
  var i;
  for (i = 0; i < octaves * octaveLength; i++) {
    // Raise pitch at start of octave
    if (i % octaveLength === 0) {
      pitch++;
    }

    // Find note letter
    var letter = octave[i % octaveLength];

    // Add white note
    addKey(letter);

    // Add black note?
    if (hasSharp(letter)) {
      addKey(letter, true);
    }
  }

  return list;
}

export const KeysList = generateKeys();
