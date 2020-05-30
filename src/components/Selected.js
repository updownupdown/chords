import React from "react";
import { selectedToNotesSubtle } from "./Utils";

export const Selected = (props) => {
  return (
    <div className="selected">
      <div className="selected-lists">
        <span className="selected-clean">
          <span className="list-label">Selected keys:</span>
          <span
            className={`list ${
              props.selected.length > 0 ? "not-empty" : "empty"
            }`}
          >
            {props.selected.length
              ? selectedToNotesSubtle(props.selected)
              : "no keys selected..."}
          </span>
        </span>
        <span className="selected-full">
          <span
            className={`list ${
              props.selected.length > 0 ? "not-empty" : "empty"
            }`}
          >
            {props.selected.length > 0 ? (
              selectedToNotesSubtle(props.selected)
            ) : (
              <span>&nbsp;</span>
            )}
          </span>
        </span>
      </div>
      <button
        onClick={() => {
          props.clearSelected();
        }}
        disabled={props.selected.length === 0}
      >
        Clear Selection
      </button>
    </div>
  );
};
