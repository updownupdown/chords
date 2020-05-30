import React from "react";
import { KeysList } from "./notes";

export function selectedToNotes(selected) {
  const list = selected.map((note) => KeysList[note].note);

  return list;
}

export function selectedToNotesSubtle(selected) {
  const list = selected.map((note, i) => (
    <span key={i}>
      {i > 0 && <span className="comma">, </span>}
      <span className="note">{KeysList[note].label}</span>
      <span className="pitch">{KeysList[note].pitch}</span>
    </span>
  ));

  return list;
}
