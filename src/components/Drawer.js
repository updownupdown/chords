import React from "react";
import Play from "../icons/play";
import "../css/drawer.scss";

export const Drawer = (props) => {
  return (
    <div className="drawer">
      <button
        className="play round-button"
        onClick={() => {
          props.playSelectedKeys();
        }}
        disabled={props.selectedMidi.length === 0}
      >
        <Play />
      </button>
    </div>
  );
};
