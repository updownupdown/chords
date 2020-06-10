import React from "react";
import classNames from "classnames";
import { WheelLines } from "./WheelLines";
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

        <div className="wheel-rotate">
          <WheelLines showChord={props.showChord} myChord={props.myChord} />

          <div className="wheel-outer">
            {outer.map((note, i) => (
              <span key={i} className="note" index={i}>
                <span
                  className={classNames("note-btn major", {
                    current: props.showKey && props.myKey.root === note,
                  })}
                  role="button"
                  onClick={() => {
                    props.getKey(note, props.myKey.type, props.myKey.subtype);
                  }}
                >
                  <span>{note}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
