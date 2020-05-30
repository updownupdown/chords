import { KeyboardMap } from "./KeyboardMap";

let list = [];
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

function addKey(letter, index, sharp) {
  var note = letter + (sharp ? "#" : "") + pitch.toString();

  var key = {
    index: index,
    color: sharp ? "black" : "white",
    label: note,
    note: note,
  };

  // Keyboard shortcut?
  var shortcutIndex = Object.values(KeyboardMap).indexOf(note);
  if (shortcutIndex > -1) {
    key.shortcut = Object.keys(KeyboardMap)[shortcutIndex];
  }

  list.push(key);
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
    addKey(letter, i);

    // Add black note?
    if (hasSharp(letter)) {
      addKey(letter, i, true);
    }
  }

  return list;
}

export const KeysList = generateKeys();
