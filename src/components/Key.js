import React from "react";
import classNames from "classnames";

export const Key = (props) => {
  return (
    <button
      className={classNames(`key key-${props.color}`, {
        active: props.selectedMidi.includes(props.midi),
      })}
      data-index={props.index}
      data-midi={props.midi}
      data-note={props.note}
      data-shortcut={props.shortcut}
      onMouseDown={() => {
        props.pianoAttack(props.note);
        props.updateSelected(
          props.midi,
          !props.selectedMidi.includes(props.index)
        );
      }}
      onMouseUp={() => {
        props.pianoRelease(props.note);
      }}
      onMouseLeave={() => {
        props.pianoRelease(props.note);
      }}
      onMouseEnter={(e) => {
        if (props.mouseDown) {
          props.pianoAttackRelease(props.note, "8n");
        }
      }}
    >
      <div className="key-label">{props.label}</div>
      {props.label === "C" && <div className="key-pitch">{props.pitch}</div>}

      {props.shortcut && (
        <div className="key-shortcut">
          <span className="key-shortcut-line"></span>
          <span className="key-shortcut-btn">{props.shortcut}</span>
        </div>
      )}
    </button>
  );
};
