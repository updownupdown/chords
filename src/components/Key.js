import React from "react";
import classNames from "classnames";

export const Key = (props) => {
  return (
    <button
      className={classNames(`key key-${props.color}`, {
        active:
          props.notesSelected.notes.includes(props.note) ||
          props.notesSelected.notes.includes(props.enharmonic),
        pressed:
          props.pressedNotes.includes(props.note) ||
          props.pressedNotes.includes(props.enharmonic),
      })}
      data-midi={props.midi}
      data-note={props.note}
      data-shortcut={props.shortcut}
      onMouseDown={() => {
        props.playPiano(props.note, "attack");
        props.updateSelected(props.index);
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
            active: props.notesSelected.notes.includes(props.note),
            flat: props.note.includes("b"),
            sharp: props.note.includes("#"),
          })}
        >
          {props.label}
        </span>

        {props.enharmonic && (
          <span
            className={classNames(`key-label`, {
              active: props.notesSelected.notes.includes(props.enharmonic),
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
