import React, { useState } from "react";
import { Note } from "@tonaljs/tonal";
import { KeyShortcuts, KeyList } from "./KeyList";
import { Key } from "./Key";
import Play from "../icons/play";
import Locked from "../icons/locked";
import Unlocked from "../icons/unlocked";
import Clear from "../icons/clear";
import "../css/keyboard.scss";

export const Keyboard = (props) => {
  const [keyDown, setKeyDown] = useState(false);

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
        props.clearSelected();
        break;
      // Enter key = play selected
      case "Enter":
        props.playSelectedKeys();
        break;
      // If key already pressed + now pressing spacebar, toggle that key
      case " ":
        if (keyDown) {
          for (var i = 0; i < KeyList.length; i++) {
            if (keyDown === KeyList[i].shortcut) {
              props.updateSelected(i);
              break;
            }
          }
        }
        break;
      default:
        // Don't both with irrelevant keys
        if (!(e.key in KeyShortcuts) && e.key !== " ") return;

        if (e.key in KeyShortcuts) {
          props.pressNote(KeyShortcuts[e.key]);
          props.pianoAttack(KeyShortcuts[e.key]);
        }
        break;
    }

    // Don't store space or special keys,
    // so key can be toggled multiple times with space
    if (e.key !== " " && e.key.length === 1) setKeyDown(e.key);
    return;
  };

  // Key Up
  document.body.onkeyup = function (e) {
    switch (e.key) {
      // Shift key temporarily (un)locks keyboard
      case e.key === "Shift":
        props.setKeyboardLocked(!props.keyboardLocked);
        break;
      default:
        if (e.key in KeyShortcuts) {
          props.unpressNote(KeyShortcuts[e.key]);
          props.pianoRelease(KeyShortcuts[e.key]);
        }
        break;
    }

    // Clear key from state
    // Avoid modifying keyDown if space or special key is being released
    // so key can be toggled multiple times with space
    if (e.key !== " " && e.key.length === 1) setKeyDown(false);
    return;
  };

  return (
    <div className={`keyboard ${props.keyboardLocked && "locked"}`}>
      <div className="keyboard-keys-wrap">
        <div className="keyboard-keys">
          {KeyList.map((key, i) => (
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
              pianoAttack={props.pianoAttack}
              pianoRelease={props.pianoRelease}
              pianoAttackRelease={props.pianoAttackRelease}
              selectedNotes={props.selectedNotes}
              pressedNotes={props.pressedNotes}
              updateSelected={props.updateSelected}
              mouseDown={props.mouseDown}
            />
          ))}
        </div>
      </div>
      <div className="keyboard-buttons">
        <div className="button-group touching">
          <button
            className={`outline ${props.keyboardLocked && "locked"}`}
            onClick={() => {
              props.setKeyboardLocked(!props.keyboardLocked);
            }}
          >
            {props.keyboardLocked ? <Locked /> : <Unlocked />}

            <span className="text">Lock</span>
          </button>
          <button
            className="play outline"
            onClick={() => {
              props.playSelectedKeys();
            }}
            disabled={props.autoplaying || props.selectedNotes.length === 0}
          >
            <Play />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.clearSelected();
            }}
            disabled={
              props.keyboardLocked ||
              props.autoplaying ||
              props.selectedNotes.length === 0
            }
          >
            <Clear />
            <span className="text">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};
