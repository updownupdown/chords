import React from "react";
import { Key } from "@tonaljs/tonal";
import Sound from "../icons/sound";
import "../css/charts.scss";

export const KeyChart = (props) => {
  function keyInfo() {
    const majorInfo = [
      // {
      //   label: "Tonic",
      //   info: "tonic",
      // },
      // {
      //   label: "Type",
      //   info: "type",
      // },
      {
        label: "Relative Minor",
        info: "relativeMinor",
      },
      {
        label: "Grades",
        info: "grades",
        object: true,
      },
      {
        label: "Intervals",
        info: "intervals",
        object: true,
      },
      {
        label: "Scale",
        info: "scale",
        object: true,
      },
      {
        label: "Chords",
        info: "chords",
        object: true,
      },
      // {
      //   label: "Chord Scales",
      //   info: "chordScales",
      //   object: true,
      // },
      // {
      //   label: "Chords Harmonic Function",
      //   info: "chordsHarmonicFunction",
      //   object: true,
      // },
      // {
      //   label: "Secondary Dominants",
      //   info: "secondaryDominants",
      //   object: true,
      // },
      // {
      //   label: "Secondary Dominants Minor Relative",
      //   info: "secondaryDominantsMinorRelative",
      //   object: true,
      // },
      // {
      //   label: "Substitute Dominants",
      //   info: "substituteDominants",
      //   object: true,
      // },
      // {
      //   label: "Substitute Dominants Minor Relative",
      //   info: "substituteDominantsMinorRelative",
      //   object: true,
      // },
    ];

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

      return majorInfo.map(
        (info, i) =>
          details[info.info] !== undefined && (
            <div key={i} className="detail">
              <span className="label">{info.label}: </span>
              <span className="value">
                {info.object
                  ? details[info.info].join(", ")
                  : details[info.info]}
              </span>
            </div>
          )
      );
    } else if (props.myKey.type === "minor") {
      const details = Key.minorKey(props.myKey.note);

      return minorInfo.map(
        (info, i) =>
          details[info.info] !== undefined && (
            <div key={i} className="detail">
              <span className="label">{info.label}: </span>
              <span className="value">
                {info.object
                  ? details[info.info].join(", ")
                  : details[info.info]}
              </span>
            </div>
          )
      );
    }

    return;
  }

  return (
    <div className="chart">
      <div className="chart-title">
        <span className="chart-title-label">
          {Object.keys(props.myKey.key).length === 0 ? (
            <span className="empty">No key selected...</span>
          ) : (
            <span>
              {props.myKey.key.tonic} {props.myKey.key.type}
            </span>
          )}
        </span>

        <div className="button-group touching">
          <button
            className="outline play-key"
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
            className="outline select-key"
            onClick={() => {
              if (Object.keys(props.myKey.key).length !== 0) {
                props.selectNotesFromKey(props.myKey.key, props.myKey.type);
              }
            }}
            disabled={
              props.autoplaying ||
              props.keyboardLocked ||
              props.onlyKeySelected ||
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
