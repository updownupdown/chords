import React from "react";
import { ChordsProvider } from "./contexts/ChordsContext";
import Keyboard from "./components/Keyboard";
import "./css/style.scss";

function App() {
  return (
    <div className="layout">
      <Keyboard />
    </div>
  );
}

export default App;
