import React from "react";

const Spoke = ({ className = "" }) => (
  <svg
    width="320"
    height="321"
    viewBox="0 0 320 321"
    fill="none"
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M201.411 6.45189C174.282 -0.817282 145.718 -0.817296 118.589 6.45185L133.083 60.5437C150.717 55.8188 169.283 55.8188 186.917 60.5437L201.411 6.45189Z"
        className="outer"
        fill="white"
        stroke="white"
      />
      <path
        className="inner"
        d="M186.917 60.5437C169.283 55.8188 150.717 55.8188 133.083 60.5437L142.504 95.7034C153.966 92.6322 166.034 92.6322 177.496 95.7034L186.917 60.5437Z"
        fill="white"
        stroke="white"
      />
    </g>
  </svg>
);

export default Spoke;
