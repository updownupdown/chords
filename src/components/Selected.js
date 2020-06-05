import React from "react";
import { selectedToNotesSimple, selectedToNotesComplex } from "./Utils";

export const Selected = (props) => {
  return (
    <div className="selected">
      <div className="selected-lists">
        <span className="selected-clean">
          <span className="list-label">Selected keys:</span>
          <span
            className={`list ${
              props.selectedMidi.length > 0 ? "not-empty" : "empty"
            }`}
          >
            {props.selectedMidi.length
              ? selectedToNotesSimple(props.selectedMidi)
              : "no keys selected..."}
          </span>
        </span>
        <span className="selected-full">
          <span
            className={`list ${
              props.selectedMidi.length > 0 ? "not-empty" : "empty"
            }`}
          >
            {props.selectedMidi.length > 0 ? (
              selectedToNotesComplex(props.selectedMidi)
            ) : (
              <span>&nbsp;</span>
            )}
          </span>
        </span>
      </div>
    </div>
  );
};
