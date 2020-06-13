import React, { useRef } from "react";
import { sortAlpha } from "./Utils";
import "../css/wheel-lines.scss";

export const WheelLines = (props) => {
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

  const notesCircle = [
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
    const drawRad = rad * 0.65;
    const cornerRad = (angle * Math.PI) / 180;
    const nx = Math.cos(cornerRad) * drawRad + rad;
    const ny = Math.sin(cornerRad) * drawRad + rad;

    return { x: nx, y: ny };
  }

  const firstUpdate = useRef(true);

  function drawShape() {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const intervals = props.myChord.chord.intervals;
    const root = props.myChord.chord.notes[0];
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

    positions = positions.sort(sortAlpha);

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
    <div className="wheel-lines">
      <svg
        className="wheel-lines-svg"
        height="320"
        width="320"
        viewBox="0 0 320 320"
      >
        {props.myChord.chord.notes !== undefined && drawShape()}
      </svg>
    </div>
  );
};
