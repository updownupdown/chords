import React from "react";
import { Note } from "@tonaljs/tonal";

export function selectedToNotes(selected) {
  const list = selected.map((note) => Note.fromMidi(note));

  return list;
}

function removeDuplicates(array) {
  return array.filter((a, b) => array.indexOf(a) === b);
}

export function selectedToNotesSimple(selected) {
  var list = [];

  for (var i = 0; i < selected.length; i++) {
    list.push(Note.fromMidi(selected[i]).replace(/[0-9]/g, ""));
  }

  // console.log(list);

  var uniqueList = removeDuplicates(list);

  const simpleList = uniqueList.map((note, i) => (
    <span key={i}>
      {i > 0 && <span className="comma">, </span>}
      <span className="note">{note}</span>
    </span>
  ));

  return simpleList;
}

export function selectedToNotesComplex(selected) {
  const list = selected.map((note, i) => (
    <span key={i}>
      {i > 0 && <span className="comma">, </span>}
      <span className="note">{Note.fromMidi(note)}</span>
    </span>
  ));

  return list;
}
