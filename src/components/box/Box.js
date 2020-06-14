import React from "react";
import { useLocalStorage } from "../../utils/LocalStorage";
import classNames from "classnames";
import ArrowDown from "../../icons/arrowdown";
import "./box.scss";

const Menu = ({ children }) => {
  return <div className="box-menu">{children}</div>;
};

const Body = ({ children }) => {
  return <div className="box-body">{children}</div>;
};

const Footer = ({ children, className }) => {
  return <div className={classNames("box-footer", className)}>{children}</div>;
};

const Box = ({ id, title, openByDefault, children }) => {
  const [open, setOpen] = useLocalStorage(`acc-opened-${id}`, openByDefault);

  return (
    <div className={`box box-${id} ${open ? "opened" : "closed"}`}>
      <div
        className="box-header"
        role="button"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="box-header-inner">
          <span className="box-header-title">{title}</span>
        </div>
        <span className="box-header-toggle">
          <ArrowDown />
        </span>
      </div>
      {open && children}
    </div>
  );
};

export default Box;

Box.Menu = Menu;
Box.Body = Body;
Box.Footer = Footer;
