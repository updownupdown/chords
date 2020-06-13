import React, {
  createContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useContext,
} from "react";
import classNames from "classnames";
import ArrowDown from "../../icons/arrowdown";
import "./box.scss";

const BoxContext = createContext();
const { Provider } = BoxContext;

const Header = ({ title, children }) => {
  const { open, toggle } = useContext(BoxContext);

  return (
    <div
      className="box-header"
      role="button"
      onClick={() => {
        toggle(!open);
      }}
    >
      <div className="box-header-inner">
        <span className="box-header-title">{title}</span>
        {children}
      </div>
      <span className="box-header-toggle">
        <ArrowDown />
      </span>
    </div>
  );
};

const Menu = ({ children }) => {
  return <div className="box-menu">{children}</div>;
};

const Body = ({ children }) => {
  return <div className="box-body">{children}</div>;
};

const Footer = ({ children, className }) => {
  return <div className={classNames("box-footer", className)}>{children}</div>;
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
Box.Menu = Menu;
Box.Body = Body;
Box.Footer = Footer;
