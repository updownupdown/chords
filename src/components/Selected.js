import React from "react";

export const Selected = (props) => {
  return (
    <div className="selected">
      <span>
        <span className="list-label">Selected keys:</span>
        <span className={`list ${!props.selected.length && "empty"}`}>
          {props.selected.length
            ? props.selected.sort().join(", ")
            : "no keys selected..."}
        </span>
      </span>
    </div>
  );
};
