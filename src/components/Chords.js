import React from "react";

export const Chords = (props) => {
  return (
    <div className="chords">
      <span>
        <span className="list-label">Predicted chords:</span>
        <span
          className={`list ${
            props.chordDetect.length > 0 ? "not-empty" : "empty"
          }`}
        >
          {props.chordDetect.length > 0
            ? props.chordDetect.join(", ")
            : "no chords detected..."}
        </span>
      </span>
    </div>
  );
};
