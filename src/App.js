import React from "react";
import Keyboard from "./components/keyboard";
import Selected from "./components/selected";
import "./css/style.scss";

function App() {
  return (
    <div className="layout">
      <Keyboard />
      <Selected />
    </div>
  );
}

export default App;
