import React, { createContext, useMemo, useContext } from "react";
import { useLocalStorage } from "../../utils/LocalStorage";
import classNames from "classnames";
import ArrowDown from "../../icons/arrowdown";
import "./box.scss";

const BoxContext = createContext();
const { Provider } = BoxContext;

const Menu = ({ children }) => {
  const { open } = useContext(BoxContext);

  if (open) {
    return <div className="box-menu">{children}</div>;
  }
  return false;
};

const Body = ({ children }) => {
  const { open } = useContext(BoxContext);

  if (open) {
    return <div className="box-body">{children}</div>;
  }
  return false;
};

const Footer = ({ children, className }) => {
  const { open } = useContext(BoxContext);

  if (open) {
    return (
      <div className={classNames("box-footer", className)}>{children}</div>
    );
  }
  return false;
};

const Box = ({ id, title, openByDefault, children }) => {
  const [open, setOpen] = useLocalStorage(`acc-opened-${id}`, openByDefault);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <Provider value={value}>
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
        {children}
      </div>
    </Provider>
  );
};

export default Box;

Box.Menu = Menu;
Box.Body = Body;
Box.Footer = Footer;
