import React from "react";

const Example = ({ className = "" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={`svg-icon ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="icon/navigation/arrow_back_ios_24px">
      <path
        id="icon/navigation/arrow_back_ios_24px_2"
        d="M17.0019 2.98518C16.5119 2.49518 15.7219 2.49518 15.2319 2.98518L6.92189 11.2952C6.53189 11.6852 6.53189 12.3152 6.92189 12.7052L15.2319 21.0152C15.7219 21.5052 16.5119 21.5052 17.0019 21.0152C17.4919 20.5252 17.4919 19.7352 17.0019 19.2452L9.76189 11.9952L17.0119 4.74518C17.4919 4.26518 17.4919 3.46518 17.0019 2.98518Z"
        fill="black"
      />
    </g>
  </svg>
);

export default Example;
