import React from "react";

const TopIndicator = ({ className = "" }) => (
  <svg
    width="56"
    height="9"
    viewBox="0 0 56 9"
    fill="none"
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M0.0426203 4.44595C-0.149186 3.35816 0.577012 2.31957 1.66707 2.14112C19.1043 -0.7134 36.8899 -0.713709 54.3273 2.14021C55.4173 2.31861 56.1436 3.35718 55.9518 4.44498L55.5143 6.92671C55.3225 8.01451 54.2854 8.73955 53.1952 8.5617C36.5069 5.83915 19.4875 5.83944 2.79936 8.56257C1.7092 8.74046 0.672021 8.01546 0.480214 6.92767L0.0426203 4.44595Z"
        fill="black"
      />
    </g>
  </svg>
);

export default TopIndicator;
