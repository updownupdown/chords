import React, { useState } from "react";
import RotateCW from "../icons/rotate-cw";
import RotateCCW from "../icons/rotate-ccw";

export const Wheel = (props) => {
  const outer = [
    "C",
    "G",
    "D",
    "A",
    "E",
    "B",
    "F#",
    "Db",
    "Ab",
    "Eb",
    "Bb",
    "F",
  ];
  const inner = [
    "a",
    "e",
    "b",
    "f#",
    "c#",
    "g#",
    "d#",
    "bb",
    "f",
    "c",
    "g",
    "d",
  ];

  const [rotateIndex, setRotateIndex] = useState(0);
  const [rotateDeg, setRotateDeg] = useState(0);

  function rotateToIndex(i) {
    if (i === rotateIndex) return;

    var distanceCW = 0;
    var distanceCCW = 0;
    var toAngle = 0;

    if (i > rotateIndex) {
      distanceCW = i - rotateIndex;
      distanceCCW = 12 - i + rotateIndex;
    } else {
      distanceCW = 12 - rotateIndex + i;
      distanceCCW = rotateIndex - i;
    }

    if (distanceCW < distanceCCW) {
      // CW
      toAngle = rotateDeg - distanceCW * 30;
      console.log("distanceCW: " + distanceCW);
    } else {
      // CCW
      toAngle = rotateDeg + distanceCCW * 30;
      console.log("distanceCCW: " + distanceCCW);
    }

    console.log("from: " + rotateIndex);
    console.log("to: " + i);
    console.log("toAngle: " + toAngle);
    console.log("rotateDeg: " + rotateDeg);

    setRotateDeg(toAngle);
    setRotateIndex(i);
    return;
  }

  return (
    <div className="wheel">
      <div className="wheelset">
        <div className="wheelset-bg wheelset-bg-outer"></div>
        <div className="wheelset-bg wheelset-bg-inner"></div>
        <div className="wheelset-highlight">
          <div class="arc"></div>
        </div>
        <div
          className="wheel-outer"
          style={{ transform: `rotate(${rotateDeg}deg)` }}
        >
          {outer.map((note, i) => (
            <span
              key={i}
              className="note"
              index={i}
              role="button"
              onClick={() => {
                rotateToIndex(i);
              }}
            >
              <span
                className={`note-btn major ${i === rotateIndex && "current"}`}
              >
                {note.length > 1 ? (
                  <>
                    <span>{note.charAt(0)}</span>
                    <span>{note.charAt(1)}</span>
                  </>
                ) : (
                  <span>{note}</span>
                )}
              </span>
              <span
                className={`note-btn minor ${i === rotateIndex && "current"}`}
              >
                {inner[i].length > 1 ? (
                  <>
                    <span>{inner[i].charAt(0)}</span>
                    <span>{inner[i].charAt(1)}</span>
                  </>
                ) : (
                  <span>{inner[i]}</span>
                )}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="wheel-arrows">
        <span
          role="button"
          className="wheel-arrow cw"
          onClick={() => {
            rotateToIndex(rotateIndex === 1 ? 12 : rotateIndex - 1);
          }}
        >
          <RotateCW />
        </span>
        <span
          role="button"
          className="wheel-arrow ccw"
          onClick={() => {
            rotateToIndex(rotateIndex === 12 ? 1 : rotateIndex + 1);
          }}
        >
          <RotateCCW />
        </span>
      </div>
    </div>
  );
};
