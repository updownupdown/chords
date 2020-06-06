import React from "react";
import { Note } from "@tonaljs/tonal";
import { KeyShortcuts, KeyList } from "./KeyList";
import { Key } from "./Key";
import "../css/keyboard.scss";

export const Keyboard = (props) => {
  var keyDown = false;

  // Key Down
  document.body.onkeydown = function (e) {
    // Prevent repeat key presses
    if (e.key === keyDown) return;

    // Delete key = Unselect keys
    if (e.key === "Delete") {
      props.clearSelected();
      return;
    }

    // Enter key = play selected
    if (e.key === "Enter") {
      props.playSelectedKeys();
      return;
    }

    // Don't both with irrelevant keys
    if (!(e.key in KeyShortcuts) && e.key !== " ") return;

    // If key already pressed + now pressing spacebar, toggle that key
    if (keyDown && e.key === " ") {
      for (var i = 0; i < KeyList.length; i++) {
        if (KeyList[i].shortcut === keyDown) {
          props.updateSelected(
            KeyList[i].note,
            !props.selectedNotes.includes(KeyList[i].note)
          );
          break;
        }
      }
    }

    if (e.key in KeyShortcuts) {
      // Add key indicator highlight
      var key = document.querySelector(`[data-note='${KeyShortcuts[e.key]}']`);
      if (key !== undefined) {
        key.classList.add("pressed");
      }

      // Start sound
      props.pianoAttack(KeyShortcuts[e.key]);
    }

    // Store for spacebar toggling
    keyDown = e.key;
    return;
  };

  // Key Up
  document.body.onkeyup = function (e) {
    if (e.key in KeyShortcuts) {
      // Remove key indicator highlight
      var key = document.querySelector(`[data-note='${KeyShortcuts[e.key]}']`);
      if (key !== undefined) {
        key.classList.remove("pressed");
      }

      // Stop sound
      props.pianoRelease(KeyShortcuts[e.key]);
    }

    // Store for spacebar toggling
    keyDown = false;
    return;
  };

  return (
    <div className="keyboard">
      <div className="keyboard-keys-wrap">
        <div className="keyboard-keys">
          {KeyList.map((key, i) => (
            <Key
              key={i}
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
              updateSelected={props.updateSelected}
              mouseDown={props.mouseDown}
            />
          ))}
        </div>
      </div>
      <div className="keyboard-buttons">
        <button
          className="play"
          onClick={() => {
            props.playSelectedKeys();
          }}
          disabled={props.autoplaying || props.selectedNotes.length === 0}
        >
          Play Selected
        </button>
        <button
          onClick={() => {
            props.clearSelected();
          }}
          disabled={props.selectedNotes.length === 0}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};
