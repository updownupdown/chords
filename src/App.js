import React from "react";
import Keyboard from "./components/keyboard";
import "./css/style.scss";

function App() {
  return (
    <div className="layout">
      <div className="layout-keyboard">
        <Keyboard />
      </div>
    </div>
  );
}

export default App;
