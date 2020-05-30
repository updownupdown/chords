import React from "react";
import { KeyboardMap } from "./KeyboardMap";
import { KeysList } from "./notes";
import { Key } from "./Key";

export const Keys = (props) => {
  var keyDown = false;

  // Key Down
  document.body.onkeydown = function (e) {
    // Don't both with irrelevant keys
    if (!(e.key in KeyboardMap) && e.key !== " ") return;

    // If valid key press + spacebar, toggle that key
    if (keyDown && e.key === " ") {
      var note = KeyboardMap[keyDown];
      props.updateSelected(note, !props.selected.includes(note));
    }

    if (e.key in KeyboardMap) {
      // Add key indicator highlight
      var key = document.querySelector(`[data-note='${KeyboardMap[e.key]}']`);
      if (key !== undefined) {
        key.classList.add("pressed");
      }

      // Start sound
      props.piano.triggerAttack(KeyboardMap[e.key]);
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
      props.piano.triggerRelease(KeyboardMap[e.key]);
    }

    // Store for spacebar toggling
    keyDown = false;
    return;
  };

  return (
    <div className="keyboard">
      {KeysList.map((key) => (
        <Key
          key={key.note}
          color={key.color}
          label={key.label}
          note={key.note}
          shortcut={key.shortcut}
          piano={props.piano}
          selected={props.selected}
          updateSelected={props.updateSelected}
          mouseDown={props.mouseDown}
        />
      ))}
    </div>
  );
};
