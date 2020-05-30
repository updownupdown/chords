import React from "react";

export const Chords = (props) => {
  return (
    <div className="chords">
      <span>
        <span className="list-label">Predicted chords:</span>
        <span className={`list ${!props.chordDetect.length && "empty"}`}>
          {props.chordDetect.length
            ? props.chordDetect.join(", ")
            : "no chords detected..."}
        </span>
      </span>
    </div>
  );
};
