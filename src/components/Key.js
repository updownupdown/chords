import React from "react";
import classNames from "classnames";

export const Key = (props) => {
  return (
    <button
      className={classNames(`key key-${props.color}`, {
        active:
          props.selected.notes.includes(props.note) ||
          props.selected.notes.includes(props.enharmonic),
        pressed:
          props.pressed.includes(props.note) ||
          props.pressed.includes(props.enharmonic),
      })}
      data-midi={props.midi}
      data-note={props.note}
      data-shortcut={props.shortcut}
      onMouseDown={() => {
        props.playPiano(props.note, "attack");
        props.toggleNote(props.index);
      }}
      onMouseUp={() => {
        props.playPiano(props.note, "release");
      }}
      onMouseLeave={() => {
        props.playPiano(props.note, "release");
      }}
      onMouseEnter={(e) => {
        if (props.mouseDown) {
          props.playPiano(props.note, "attackrelease");
        }
      }}
    >
      {props.shortcut && (
        <div className="key-shortcut">
          <span className="key-shortcut-line"></span>
          <span className="key-shortcut-btn">{props.shortcut}</span>
        </div>
      )}

      <span className="key-labels">
        <span
          className={classNames(`key-label`, {
            active: props.selected.notes.includes(props.note),
            flat: props.note.includes("b"),
            sharp: props.note.includes("#"),
          })}
        >
          {props.label}
        </span>

        {props.enharmonic && (
          <span
            className={classNames(`key-label`, {
              active: props.selected.notes.includes(props.enharmonic),
              flat: props.enharmonic.includes("b"),
              sharp: props.enharmonic.includes("#"),
            })}
          >
            {props.enharmoniclabel}
          </span>
        )}
      </span>
    </button>
  );
};
