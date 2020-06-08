import React from "react";

const ArrowUp = ({ className = "" }) => (
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
        d="M8.70621 12.5863L11.2962 9.99625C11.6862 9.60625 12.3162 9.60625 12.7062 9.99625L15.2962 12.5863C15.9262 13.2163 15.4762 14.2963 14.5862 14.2963H9.40621C8.51621 14.2963 8.07621 13.2163 8.70621 12.5863Z"
        fill="black"
      />
    </g>
  </svg>
);

export default ArrowUp;
