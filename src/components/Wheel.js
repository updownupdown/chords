import React, { useState, useRef } from "react";
import classNames from "classnames";
import Related from "../icons/related";
import TopIndicator from "../icons/topindicator";
import RotateCW from "../icons/rotate-cw";
import RotateCCW from "../icons/rotate-ccw";
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

  var notesCircle = [
    "A",
    "E",
    "B",
    "F#",
    "Db",
    "Ab",
    "Eb",
    "Bb",
    "F",
    "C",
    "G",
    "D",
  ];

  const intervalsIncrements = {
    "1P": 0,
    "1A": -5,
    //
    "2M": 2,
    "2m": -5,
    "2d": 0,
    "2A": -3,
    //
    "3M": 4,
    "3m": -3,
    "3d": 2,
    "3A": -1,
    //
    "4P": -1,
    "4d": 4,
    "4A": 6,
    //
    "5P": 1,
    "5d": 6,
    "5A": -4,
    //
    "6M": 3,
    "6m": -4,
    "6d": 1,
    "6A": 5,
    //
    "7M": 5,
    "7m": -2,
    "7d": 3,
    "7A": 0,
    //
    "8P": 0,
    "8d": 5,
    "8A": -5,
    //
    // 9 and up repeat 2 and up
    //
  };

  function findPoint(angle) {
    const rad = 320 / 2;
    const drawRad = rad * 0.7;
    var cornerRad = (angle * Math.PI) / 180;
    var nx = Math.cos(cornerRad) * drawRad + rad;
    var ny = Math.sin(cornerRad) * drawRad + rad;

    return { x: nx, y: ny };
  }

  const firstUpdate = useRef(true);

  function drawShape() {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const intervals = props.chosenChord.chord.intervals;
    const root = props.chosenChord.chord.notes[0];
    const rootEquiv = wheelEquivalents[root];
    const rootPos = notesCircle.indexOf(rootEquiv);
    const dotRad = 6;
    var points = [];
    var circles = [];

    var positions = [];
    for (var i = 0; i < intervals.length; i++) {
      // simplify large intervals and get increment on CoF
      var intervalNum = intervals[i].slice(0, -1);
      const intervalQual = intervals[i].substr(intervals[i].length - 1);

      if (intervalNum > 8) {
        intervalNum = (intervalNum % 9) + 2;
      }

      const interval = intervalNum + intervalQual;
      const increment = intervalsIncrements[interval];
      const pos = (rootPos + increment) % 12;
      positions.push(pos);
    }

    function compare(a, b) {
      if (a > b) return 1;
      if (b > a) return -1;

      return 0;
    }

    positions = positions.sort(compare);

    for (var p = 0; p < positions.length; p++) {
      const point = findPoint(positions[p] * 30);

      circles.push(
        <circle
          key={p}
          cx={point.x}
          cy={point.y}
          r={dotRad}
          className={positions[p] === rootPos ? "root" : "non-root"}
        />
      );

      points.push(point.x + " " + point.y);
    }

    return (
      <>
        <polygon points={points.join(", ")} />
        {circles.map((circle) => circle)}
      </>
    );
  }

  return (
    <div className="wheel-wrap">
      <div
        className={classNames("wheel", {
          [`theme-${props.notesSelected.type}`]: true,
        })}
      >
        <div className="wheel-background">
          <div className="outer"></div>
          <div className="gap"></div>
          <div className="inner"></div>
          <div className="center"></div>
        </div>

        <div className="wheel-related">
          <Related />
        </div>
        <div
          className="wheel-rotate"
          style={{ transform: `rotate(${rotateDeg}deg)` }}
        >
          <div className="wheel-indicator">
            <TopIndicator />
          </div>
          <div className="wheel-lines">
            <svg
              className="wheel-lines-svg"
              height="320"
              width="320"
              viewBox="0 0 320 320"
            >
              {props.chosenChord.chord.notes !== undefined && drawShape()}
            </svg>
          </div>
          <div className="wheel-outer">
            {outer.map((note, i) => (
              <span key={i} className="note" index={i}>
                <span
                  className={classNames("note-btn major", {
                    current:
                      props.myKey.note === outer[i] &&
                      props.myKey.type === "major",
                  })}
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
                  className={classNames("note-btn minor", {
                    current:
                      props.myKey.note === inner[i] &&
                      props.myKey.type === "minor",
                  })}
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

const wheelEquivalents = {
  C: "C",
  Cb: "B",
  "C#": "Db",
  D: "D",
  Db: "Db",
  "D#": "Eb",
  E: "E",
  Eb: "Eb",
  "E#": "F",
  F: "F",
  Fb: "E",
  "F#": "F#",
  G: "G",
  Gb: "F#",
  "G#": "Ab",
  A: "A",
  Ab: "Ab",
  "A#": "Bb",
  B: "B",
  Bb: "Bb",
  "B#": "C",
};
