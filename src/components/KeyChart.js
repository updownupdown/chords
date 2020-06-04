import React from "react";
import Treble from "../icons/treble";
import Sharp from "../icons/sharp";
import Flat from "../icons/flat";
import { Key } from "@tonaljs/tonal";

export const KeyChart = (props) => {
  function keyInfo() {
    const majorInfo = [
      {
        label: "Tonic",
        info: "tonic",
      },
      {
        label: "Type",
        info: "type",
      },
      {
        label: "Key Signature",
        info: "keySignature",
      },
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
      {
        label: "Tonic",
        info: "tonic",
      },
      {
        label: "Type",
        info: "type",
      },
      {
        label: "Key Signature",
        info: "keySignature",
      },
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
            <span key={i}>
              <span className="label">{info.label}: </span>
              <span className="value">
                {info.object
                  ? details[info.info].join(", ")
                  : details[info.info]}
              </span>
            </span>
          )
      );
    } else if (props.myKey.type === "minor") {
      const details = Key.minorKey(props.myKey.note);

      return minorInfo.map(
        (info, i) =>
          details[info.info] !== undefined && (
            <span key={i}>
              <span className="label">{info.label}: </span>
              <span className="value">
                {info.object
                  ? details[info.info].join(", ")
                  : details[info.info]}
              </span>
            </span>
          )
      );
    }

    return;
  }

  const signature = props.myKey.key.keySignature;
  const accidental = signature === undefined ? undefined : signature.charAt(0);

  const sharps = ["F", "C", "G", "D", "A", "E", "B"];

  function sigList(sig) {
    let list = [];
    for (var i = 0; i < sig.length; i++) {
      list.push(
        <span
          key={i}
          className={accidental === "#" ? "sharp" : "flat"}
          title={accidental === "#" ? sharps[i] : sharps[sharps.length - i - 1]}
        >
          <span className="hover-zone"></span>
          {accidental === "#" ? <Sharp /> : <Flat />}
        </span>
      );
    }
    return list;
  }

  return (
    <div className="key-chart">
      <div className="key-chart-signature">
        <div className="treble-clef">
          <Treble />
        </div>
        <div className="lines">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="sharps-flats">{signature && sigList(signature)}</div>
      </div>
      <div className="key-chart-details">
        {props.myKey.note ? keyInfo() : "Select a key..."}
      </div>
    </div>
  );
};
