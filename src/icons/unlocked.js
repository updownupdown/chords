import React from "react";

const Unlocked = ({ className = "" }) => (
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 8.5H18C19.1 8.5 20 9.4 20 10.5V20.5C20 21.6 19.1 22.5 18 22.5H6C4.9 22.5 4 21.6 4 20.5V10.5C4 9.4 4.9 8.5 6 8.5H15V6.5C15 4.85 13.65 3.5 12 3.5C10.63 3.5 9.44 4.43 9.1 5.75C8.96 6.29 8.41 6.61 7.88 6.47C7.34 6.33 7.02 5.79 7.16 5.25C7.73 3.04 9.72 1.5 12 1.5C14.76 1.5 17 3.74 17 6.5V8.5ZM17 20.5C17.55 20.5 18 20.05 18 19.5V11.5C18 10.95 17.55 10.5 17 10.5H7C6.45 10.5 6 10.95 6 11.5V19.5C6 20.05 6.45 20.5 7 20.5H17Z"
        fill="black"
      />
    </g>
  </svg>
);

export default Unlocked;
