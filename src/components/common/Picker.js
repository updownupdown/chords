import React, { useState, useEffect, useRef } from "react";
import ArrowDown from "../../icons/arrowdown";
import classNames from "classnames";
import "./picker.scss";

export const Picker = (props) => {
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  return (
    <div ref={ref} className={classNames("picker", props.className)}>
      <div
        className="picker-toggle"
        onClick={() => setIsComponentVisible(!isComponentVisible)}
      >
        <span>{props.selected}</span>
        <ArrowDown />
      </div>
      {isComponentVisible && (
        <div
          className="picker-menu"
          onClick={() => setIsComponentVisible(false)}
        >
          {props.children}
        </div>
      )}
    </div>
  );
};

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = useRef(null);

  // const handleHideDropdown = (event: KeyboardEvent) => {
  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
