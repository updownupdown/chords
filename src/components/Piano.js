import React, { useState } from "react";
import classNames from "classnames";
import { Note } from "@tonaljs/tonal";
import { keyList } from "./Lists";
import { Key } from "./Key";
import Sound from "../icons/sound";
import Locked from "../icons/locked";
import Unlocked from "../icons/unlocked";
import Clear from "../icons/clear";
import "../css/keyboard.scss";

export const Piano = (props) => {
  const [keyDown, setKeyDown] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Handle mouse down state
  function setLeftButtonState(e) {
    setMouseDown(e.buttons === undefined ? e.which === 1 : e.buttons === 1);
  }
  document.body.onmousedown = setLeftButtonState;
  document.body.onmouseup = setLeftButtonState;

  // Key Down
  document.body.onkeydown = function (e) {
    switch (e.key) {
      // Prevent repeat key presses
      case keyDown:
        return;
      // Shift key temporarily (un)locks keyboard
      case "Shift":
        props.setKeyboardLocked(!props.keyboardLocked);
        break;
      // Delete key = Unselect keys
      case "Delete":
        props.setNotesSelected({ notes: [], type: "notes" });
        break;
      // Enter key = play selected
      case "Enter":
        props.playNotes();
        break;
      default:
        // Don't both with irrelevant keys
        if (!(e.key in keyShortcuts)) return;

        if (e.key in keyShortcuts) {
          props.playPiano(keyShortcuts[e.key], "attack");
          props.pressNote(keyShortcuts[e.key], "on");
        }
        break;
    }

    setKeyDown(true);
    return;
  };

  // Key Up
  document.body.onkeyup = function (e) {
    switch (e.key) {
      // Shift key temporarily (un)locks keyboard
      case "Shift":
        props.setKeyboardLocked(!props.keyboardLocked);
        break;
      default:
        props.playPiano(keyShortcuts[e.key], "release");
        props.pressNote(keyShortcuts[e.key], "off");
        break;
    }

    setKeyDown(false);
    return;
  };

  return (
    <div
      className={classNames("keyboard", {
        [`theme-${props.notesSelected.type}`]: true,
        "theme-locked": props.keyboardLocked,
        "show-shortcuts": showShortcuts,
      })}
    >
      {!showShortcuts && (
        <button
          className="outline view-keyboard-shortcuts"
          onClick={() => {
            setShowShortcuts(true);
          }}
        >
          View Keyboard Shortcuts
        </button>
      )}
      <div className="keyboard-buttons">
        <button
          className={`outline ${props.keyboardLocked && "theme-locked"}`}
          onClick={() => {
            props.setKeyboardLocked(!props.keyboardLocked);
          }}
        >
          {props.keyboardLocked ? <Locked /> : <Unlocked />}

          <span className="text">Lock</span>
        </button>
        <div className="button-group touching">
          <button
            className="play outline"
            onClick={() => {
              props.playNotes();
            }}
            disabled={
              props.keyboardLocked || props.notesSelected.notes.length === 0
            }
          >
            <Sound />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.setNotesSelected({ notes: [], type: "notes" });
            }}
            disabled={
              props.keyboardLocked || props.notesSelected.notes.length === 0
            }
          >
            <Clear />
            <span className="text">Clear</span>
          </button>
        </div>
      </div>
      <div className="keyboard-keys-wrap">
        <div className="keyboard-keys">
          {keyList.map((key, i) => (
            <Key
              key={i}
              index={i}
              color={key.color}
              note={key.note}
              enharmonic={key.enharmonic}
              label={key.label}
              enharmoniclabel={key.enharmoniclabel}
              midi={Note.midi(key.note)}
              shortcut={key.shortcut}
              playPiano={props.playPiano}
              notesSelected={props.notesSelected}
              pressedNotes={props.pressedNotes}
              updateSelected={props.updateSelected}
              mouseDown={mouseDown}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const keyShortcuts = {
  q: "G#3",
  a: "A3",
  w: "A#3",
  s: "B3",
  d: "C4",
  r: "C#4",
  f: "D4",
  t: "D#4",
  g: "E4",
  h: "F4",
  u: "F#4",
  j: "G4",
  i: "G#4",
  k: "A4",
  o: "A#4",
  l: "B4",
  ";": "C5",
  "[": "C#5",
  "'": "D5",
  "]": "D#5",
};
