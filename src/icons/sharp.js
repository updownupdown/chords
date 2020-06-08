import React from "react";

const Sharp = ({ className = "" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className={`svg-icon sharp ${className || ""}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path
        d="M15.5245 8.8909V5.69466L14.0718 6.0784V0H13.1418V6.32354L11.0272 6.88132V0.813523H10.0974V7.12622L8.47546 7.55407V10.8086L10.0974 10.3675V15.146L8.47546 15.5738V18.8279L10.0974 18.3868V24H11.0272V18.1342L13.1418 17.5588V23.1867H14.0718V17.3057L15.5245 16.9107V13.7144L14.0718 14.0977V9.28621L15.5245 8.8909ZM13.1416 14.3431L11.0269 14.9008V10.1144L13.1416 9.53906V14.3431V14.3431Z"
        fill="black"
      />
    </g>
  </svg>
);

export default Sharp;
