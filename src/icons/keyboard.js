import React from "react";

const Keyboard = ({ className = "" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon-keyboard">
      <path
        id="icon-keyboard_2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.99997 5H20C21.1 5 22 5.9 22 7V17C22 18.1 21.1 19 20 19H3.99997C2.89997 19 1.99997 18.1 1.99997 17L2.00997 7C2.00997 5.9 2.89997 5 3.99997 5ZM13 8H11V10H13V8ZM11 11H13V13H11V11ZM9.99997 8H7.99997V10H9.99997V8ZM7.99997 11H9.99997V13H7.99997V11ZM4.99997 13H6.99997V11H4.99997V13ZM6.99997 10H4.99997V8H6.99997V10ZM8.99997 17H15C15.55 17 16 16.55 16 16C16 15.45 15.55 15 15 15H8.99997C8.44997 15 7.99997 15.45 7.99997 16C7.99997 16.55 8.44997 17 8.99997 17ZM16 13H14V11H16V13ZM14 10H16V8H14V10ZM19 13H17V11H19V13ZM17 10H19V8H17V10Z"
        fill="black"
      />
    </g>
  </svg>
);

export default Keyboard;
