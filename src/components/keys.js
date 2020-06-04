import React from "react";
import { Note } from "@tonaljs/tonal";
import { KeyboardMap } from "./KeyboardMap";
import { KeysList } from "./notes";
import { Key } from "./Key";
import "../css/keys.scss";

export const Keys = (props) => {
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
    if (!(e.key in KeyboardMap) && e.key !== " ") return;

    // If key already pressed + now pressing spacebar, toggle that key
    if (keyDown && e.key === " ") {
      for (var i = 0; i < KeysList.length; i++) {
        if (KeysList[i].shortcut === keyDown) {
          props.updateSelected(
            KeysList[i].midi,
            !props.selectedMidi.includes(KeysList[i].midi)
          );
          break;
        }
      }
    }

    if (e.key in KeyboardMap) {
      // Add key indicator highlight
      var key = document.querySelector(`[data-note='${KeyboardMap[e.key]}']`);
      if (key !== undefined) {
        key.classList.add("pressed");
      }

      // Start sound
      props.pianoAttack(KeyboardMap[e.key]);
    }

    // Store for spacebar toggling
    keyDown = e.key;
    return;
  };

  // Key Up
  document.body.onkeyup = function (e) {
    if (e.key in KeyboardMap) {
      // Remove key indicator highlight
      var key = document.querySelector(`[data-note='${KeyboardMap[e.key]}']`);
      if (key !== undefined) {
        key.classList.remove("pressed");
      }

      // Stop sound
      props.pianoRelease(KeyboardMap[e.key]);
    }

    // Store for spacebar toggling
    keyDown = false;
    return;
  };

  return (
    <div className="keyboard">
      {KeysList.map((key) => (
        <Key
          key={key.index}
          index={key.index}
          color={key.color}
          label={key.label}
          note={key.note}
          midi={Note.midi(key.note)}
          pitch={key.pitch}
          shortcut={key.shortcut}
          pianoAttack={props.pianoAttack}
          pianoRelease={props.pianoRelease}
          pianoAttackRelease={props.pianoAttackRelease}
          selectedMidi={props.selectedMidi}
          updateSelected={props.updateSelected}
          mouseDown={props.mouseDown}
        />
      ))}
    </div>
  );
};
