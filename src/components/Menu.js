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
          <button disabled>Info</button>
          <button disabled>Help</button>
          <button disabled>Settings</button>
        </div>
      </div>
    </div>
  );
};
