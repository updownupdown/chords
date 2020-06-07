import React from "react";
import { Key } from "@tonaljs/tonal";
import Sound from "../icons/sound";
import "../css/charts.scss";

export const KeyChart = (props) => {
  function keyInfo() {
    const minorInfo = [
      // {
      //   label: "Tonic",
      //   info: "tonic",
      // },
      // {
      //   label: "Type",
      //   info: "type",
      // },
      // {
      //   label: "Key Signature",
      //   info: "keySignature",
      // },
      {
        label: "Relative Major",
        info: "relativeMajor",
      },
    ];

    if (props.myKey.type === "major") {
      const details = Key.majorKey(props.myKey.note);

      // console.log(details);

      return (
        <>
          <div className="detail">
            <span className="label">Relative Minor</span>
            <span className="value">
              {details["minorRelative"] && (
                <button
                  className="small theme-key"
                  onClick={() => {
                    props.findKey(details["minorRelative"], "minor");
                  }}
                >
                  {details["minorRelative"]} minor
                </button>
              )}
            </span>
          </div>
          <div className="detail">
            <span className="label">Grades</span>
            <span className="value">
              {details["grades"] && details["grades"].join(", ")}
            </span>
          </div>
          <div className="detail">
            <span className="label">Intervals</span>
            <span className="value">
              {details["intervals"] && details["intervals"].join(", ")}
            </span>
          </div>
          <div className="detail">
            <span className="label">Scale</span>
            <span className="value">
              {details["scale"] && details["scale"].join(", ")}
            </span>
          </div>
          <div className="detail">
            <span className="label">Chords</span>
            <span className="value">
              <div className="button-group">
                {details["chords"] &&
                  details["chords"].map((chord, i) => (
                    <button
                      key={i}
                      className="small theme-chord"
                      onClick={() => {
                        props.getChord(chord);
                      }}
                    >
                      {chord}
                    </button>
                  ))}
              </div>
            </span>
          </div>
        </>
      );
    } else if (props.myKey.type === "minor") {
      const details = Key.minorKey(props.myKey.note);

      return (
        <div className="detail">
          <span className="label">Relative Major</span>
          <span className="value">
            {details["relativeMajor"] && (
              <button
                className="small theme-key"
                onClick={() => {
                  props.findKey(details["relativeMajor"], "major");
                }}
              >
                {details["relativeMajor"]} major
              </button>
            )}
          </span>
        </div>
      );
    }

    return;
  }

  return (
    <div className="chart">
      <div className="chart-title">
        <span className="chart-title-label">
          {Object.keys(props.myKey.key).length === 0 ? (
            <span className="empty">Key</span>
          ) : (
            <span className="color-theme-key">
              {props.myKey.key.tonic} {props.myKey.key.type}
            </span>
          )}
        </span>

        <div className="button-group touching">
          <button
            className="outline theme-key play-key"
            onClick={
              Object.keys(props.myKey.key).length !== 0 ? props.playScale : null
            }
            disabled={
              props.autoplaying || Object.keys(props.myKey.key).length === 0
            }
          >
            <Sound />
          </button>
          <button
            className="outline theme-key select-key"
            onClick={() => {
              if (Object.keys(props.myKey.key).length !== 0) {
                props.selectNotesFromKey(props.myKey.key, props.myKey.type);
              }
            }}
            disabled={
              props.autoplaying ||
              props.keyboardLocked ||
              Object.keys(props.myKey.key).length === 0
            }
          >
            <span className="text">Select</span>
          </button>
        </div>
      </div>

      <div className="chart-details">{props.myKey.note && keyInfo()}</div>
    </div>
  );
};
