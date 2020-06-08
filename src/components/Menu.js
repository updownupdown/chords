import React from "react";
import "../css/menu.scss";

export const Menu = (props) => {
  return (
    <div className="menu">
      <div className="menu-center">
        <div className="menu-left">
          <h2>Piano Chords</h2>
        </div>
        <div className="menu-right">
          <div className="button-group">
            <button
              className="outline"
              onClick={() => {
                window.open("https://github.com/updownupdown/chords", "_blank");
              }}
            >
              About
            </button>
            {/* <button className="outline" disabled>
              Help
            </button>
            <button className="outline" disabled>
              Settings
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
