import React, { useState } from "react";
import RotateCW from "../icons/rotate-cw";
import RotateCCW from "../icons/rotate-ccw";
import Play from "../icons/play";
import "../css/wheel.scss";

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
      toAngle = rotateDeg - distanceCW * 30;
    } else {
      toAngle = rotateDeg + distanceCCW * 30;
    }

    setRotateDeg(toAngle);
    setRotateIndex(i);
    return;
  }

  return (
    <div className="wheel-wrap">
      <div className="wheel">
        <div className="wheel-background">
          <div className="outer"></div>
          <div className="gap"></div>
          <div className="inner"></div>
          <div className="center"></div>
        </div>
        <button
          className="wheel-play round-button"
          onClick={
            Object.keys(props.myKey.key).length !== 0 ? props.playScale : null
          }
          disabled={
            props.autoplaying || Object.keys(props.myKey.key).length === 0
          }
        >
          <Play />
        </button>
        <div className="wheel-highlight">
          <div className="arc"></div>
        </div>
        <div
          className="wheel-outer"
          style={{ transform: `rotate(${rotateDeg}deg)` }}
        >
          {outer.map((note, i) => (
            <span key={i} className="note" index={i}>
              <span
                className={`note-btn major ${
                  props.myKey.note === outer[i] &&
                  props.myKey.type === "major" &&
                  "current"
                }`}
                role="button"
                onClick={() => {
                  rotateToIndex(i);
                  props.findKey(outer[i], "major");
                }}
              >
                {outer[i].length > 1 ? (
                  <>
                    <span>{outer[i].charAt(0)}</span>
                    <span>{outer[i].charAt(1)}</span>
                  </>
                ) : (
                  <span>{outer[i]}</span>
                )}
              </span>
              <span
                className={`note-btn minor ${
                  props.myKey.note === inner[i] &&
                  props.myKey.type === "minor" &&
                  "current"
                }`}
                role="button"
                onClick={() => {
                  rotateToIndex(i);
                  props.findKey(inner[i], "minor");
                }}
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

        <span
          role="button"
          className="wheel-arrow cw"
          onClick={() => {
            const rotateTo = rotateIndex === 0 ? 11 : rotateIndex - 1;
            const type = props.myKey.type ? props.myKey.type : "major";
            rotateToIndex(rotateTo);
            props.findKey(
              type === "major" ? outer[rotateTo] : inner[rotateTo],
              type
            );
          }}
        >
          <RotateCW />
        </span>
        <span
          role="button"
          className="wheel-arrow ccw"
          onClick={() => {
            const rotateTo = rotateIndex === 11 ? 0 : rotateIndex + 1;
            const type = props.myKey.type ? props.myKey.type : "major";
            rotateToIndex(rotateTo);
            props.findKey(
              type === "major" ? outer[rotateTo] : inner[rotateTo],
              type
            );
          }}
        >
          <RotateCCW />
        </span>
      </div>
    </div>
  );
};
