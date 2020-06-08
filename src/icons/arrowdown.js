import React from "react";

const ArrowDown = ({ className = "" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M8.70621 11.4138L11.2962 14.0038C11.6862 14.3938 12.3162 14.3938 12.7062 14.0038L15.2962 11.4138C15.9262 10.7838 15.4762 9.70375 14.5862 9.70375H9.40621C8.51621 9.70375 8.07621 10.7838 8.70621 11.4138Z"
        fill="black"
      />
    </g>
  </svg>
);

export default ArrowDown;
