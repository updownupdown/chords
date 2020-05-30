// import React, { useState } from "react";

const octave = ["C", "D", "E", "F", "G", "A", "B"];
const octaveLength = octave.length;
const pitchStart = 2;
const octaves = 3;

var keyboardMap = {
  a: "F3",
  w: "F#3", // black
  s: "G3",
  e: "G#3", // black
  d: "A3",
  r: "A#3",
  f: "B3", // black
  g: "C4",
  y: "C#4", // black
  h: "D4",
  u: "D#4", // black
  j: "E4",
  k: "F4",
  o: "F#4", // black
  l: "G4",
  p: "G#4", // black
  ";": "A4",
  "[": "A#4",
  "'": "B4",
  "]": "A#4",
};

function hasSharp(note) {
  if (note !== "E" && note !== "B") {
    return true;
  }
  return false;
}

const keysList = [];

function addKey(note, sharp: false) {
  var noteHuman = note + (sharp ? "#" : "") + pitch.toString();

  console.log(noteHuman);

  var key = {
    color: sharp ? "black" : "white",
    label: noteHuman,
    note: noteHuman,
  };

  var shortcutIndex = Object.values(keyboardMap).indexOf(noteHuman);

  if (shortcutIndex > -1) {
    key.shortcut = Object.keys(keyboardMap)[shortcutIndex];
  }

  keysList.push(key);
}

var i;
var pitch = pitchStart;
for (i = 0; i < octaves * octaveLength; i++) {
  // Raise pitch at start of octave
  if (i % octaveLength === 0) {
    pitch++;
  }

  // Find note letter
  var note = octave[i % octaveLength];

  // White notes
  addKey(note);

  // Black note?
  if (hasSharp(note)) {
    addKey(note, true);
  }
}

export const keys = keysList;

export const shortcuts = keyboardMap;
