// import React, { useState } from "react";

const octave = ["C", "D", "E", "F", "G", "A", "B"];
const octaveLength = octave.length;
const pitchStart = 2;
const octaves = 3;

function hasSharp(note) {
  if (note !== "E" && note !== "B") {
    return true;
  }
  return false;
}

const keysList = [];

var i;
var pitch = pitchStart;
for (i = 0; i < octaves * octaveLength; i++) {
  // Raise pitch at start of octave
  if (i % octaveLength === 0) {
    pitch++;
  }

  // Find note letter
  var note = octave[i % octaveLength];

  // White Notes
  keysList.push({
    color: "white",
    label: note + pitch.toString(),
    note: note + pitch.toString(),
  });

  // Black Notes
  if (hasSharp(note)) {
    keysList.push({
      color: "black",
      label: note + "#" + pitch.toString(),
      note: note + "#" + pitch.toString(),
    });
  }
}

export const keys = keysList;
