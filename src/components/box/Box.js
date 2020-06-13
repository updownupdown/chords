// import React, { useState } from "react";
import React, {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useContext,
} from "react";

import ArrowDown from "../../icons/arrowdown";
import "./box.scss";

const BoxContext = createContext();
const { Provider } = BoxContext;

const Header = ({ title, children }) => {
  const { open, toggle } = useContext(BoxContext);

  return (
    <div className="box-header">
      <div className="box-header-inner">
        <span className="box-header-title">{title}</span>
        {children}
      </div>
      <button
        className="outline box-header-toggle"
        onClick={() => {
          toggle(!open);
        }}
      >
        <ArrowDown />
      </button>
    </div>
  );
};

const Body = ({ children }) => {
  return (
    <div className="box-body">
      <div className="box-body-inner">{children}</div>
    </div>
  );
};

const Footer = ({ children }) => {
  return <div className="box-footer">{children}</div>;
};

const Box = ({ type, children, onOpen }) => {
  const [open, setOpen] = useState(true);

  const toggle = useCallback(() => setOpen((prevOpen) => !prevOpen), []);
  const componentJustMounted = useRef(true);
  useEffect(() => {
    if (!componentJustMounted) {
      onOpen(open);
    }
    componentJustMounted.current = false;
  }, [open, onOpen]);
  const value = useMemo(() => ({ open, toggle }), [open, toggle]);

  return (
    <Provider value={value}>
      <div className={`box box-${type} ${open ? "opened" : "closed"}`}>
        {children}
      </div>
    </Provider>
  );
};

export default Box;

Box.Header = Header;
Box.Body = Body;
Box.Footer = Footer;
