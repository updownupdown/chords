import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

export const Picker = (props) => {
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false);

  return (
    <div ref={ref} className={classNames("picker", props.className)}>
      <div
        className="picker-header"
        onClick={() => setIsComponentVisible(!isComponentVisible)}
      >
        {props.selected}
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

  const handleHideDropdown = (event: KeyboardEvent) => {
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
