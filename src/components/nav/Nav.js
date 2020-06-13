import React from "react";
import "./nav.scss";

export const Nav = (props) => {
  return (
    <div className="nav">
      <div className="nav-center">
        <div className="nav-left">
          <h2>Piano Chords</h2>
        </div>
        <div className="nav-right">
          <div className="button-group">
            <button
              className="show-shortcuts"
              onClick={() => {
                props.setShowShortcuts(!props.showShortcuts);
              }}
            >
              Keyboard Shortcuts
            </button>
            <button
              onClick={() => {
                window.open("https://github.com/updownupdown/chords", "_blank");
              }}
            >
              About
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
