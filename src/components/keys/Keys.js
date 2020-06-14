import React from "react";
import { Key } from "@tonaljs/tonal";
import { Picker } from "../common/Picker";
import { KeyInfo } from "./KeyInfo";
import PlaySeparate from "../../icons/playsep";
import Piano from "../../icons/piano";
import Box from "../box/Box";
import "./keys.scss";

export const Keys = (props) => {
  function relativeKey() {
    var relativeRoot = "";
    var type = props.myKey.type;
    var relativeType = "";

    if (type === "major") {
      relativeRoot = Key.majorKey(props.myKey.root)["minorRelative"];
      relativeType = "minor";
    } else if (type === "minor") {
      relativeRoot = Key.minorKey(props.myKey.root)["relativeMajor"];
      relativeType = "major";
    }

    return (
      <div className="relative-key">
        <span className="label">Relative Key:</span>
        <span className="value">
          <button
            className="small theme-key"
            onClick={() => {
              props.getKey(
                relativeRoot,
                relativeType,
                relativeType === "major" ? "" : "natural"
              );
            }}
          >
            {`${relativeRoot} ${relativeType}`}
          </button>
        </span>
      </div>
    );
  }

  const octave = ["C", "D", "E", "F", "G", "A", "B"];

  const noteChoices = octave.map((note, i) => (
    <span key={i} className="note">
      <button
        className="natural"
        onClick={() => {
          props.getKey(note, props.myKey.type, props.myKey.subtype);
        }}
        disabled={props.myKey.root === note}
      >
        {note}
      </button>
      <button
        className="flat"
        onClick={() => {
          props.getKey(note + "b", props.myKey.type, props.myKey.subtype);
        }}
        disabled={props.myKey.root === note + "b"}
      >
        {note}b
      </button>
      <button
        className="sharp"
        onClick={() => {
          props.getKey(note + "#", props.myKey.type, props.myKey.subtype);
        }}
        disabled={props.myKey.root === note + "#"}
      >
        {note}#
      </button>
    </span>
  ));

  const keyChoices = (
    <>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "major", "");
        }}
        disabled={props.myKey.type === "major"}
      >
        Major
      </button>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "minor", "natural");
        }}
        disabled={
          props.myKey.type === "minor" && props.myKey.subtype === "natural"
        }
      >
        Minor Natural
      </button>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "minor", "harmonic");
        }}
        disabled={
          props.myKey.type === "minor" && props.myKey.subtype === "harmonic"
        }
      >
        Minor Harmonic
      </button>
      <button
        onClick={() => {
          props.getKey(props.myKey.root, "minor", "melodic");
        }}
        disabled={
          props.myKey.type === "minor" && props.myKey.subtype === "melodic"
        }
      >
        Minor Melodic
      </button>
    </>
  );

  return (
    <>
      <Box id="key" title="Key" openByDefault={true}>
        <Box.Menu>
          <div className="picker-group theme-key">
            <Picker className="picker-notes" selected={props.myKey.root}>
              <div className="picker-notes-menu">{noteChoices}</div>
            </Picker>
            <Picker
              className="picker-keys"
              selected={`${props.myKey.type} ${
                props.myKey.subtype ? props.myKey.subtype : ""
              }`}
            >
              <div className="picker-keys-menu">{keyChoices}</div>
            </Picker>
          </div>
          <div className="button-group touching">
            <button
              className="select-key small-on-mobile"
              onClick={() => {
                props.getKey(
                  props.myKey.root,
                  props.myKey.type,
                  props.myKey.subtype
                );
              }}
              disabled={
                props.autoplaying ||
                props.pianoLocked ||
                (props.selected.cat === "key" &&
                  Object.keys(props.myKey.key).length !== 0)
              }
            >
              <Piano />
              <span className="text">Select</span>
            </button>
            <button
              className="small-on-mobile"
              onClick={() => {
                props.playPiano("scale", false);
              }}
              disabled={
                props.autoplaying || Object.keys(props.myKey.key).length === 0
              }
            >
              <PlaySeparate />
              <span className="text">Play</span>
            </button>
          </div>
        </Box.Menu>
        <Box.Body>
          <KeyInfo
            myKey={props.myKey}
            myChord={props.myChord}
            getChord={props.getChord}
            playPiano={props.playPiano}
          />
        </Box.Body>
        <Box.Footer>{relativeKey()}</Box.Footer>
      </Box>
    </>
  );
};
