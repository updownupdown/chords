import React from "react";
import classNames from "classnames";
import Play from "../../icons/play";
import Clear from "../../icons/clear";
import Add from "../../icons/add";
import Trash from "../../icons/trash";
import Copy from "../../icons/copy";
import Box from "../box/Box";
import "./progs.scss";

export const ChordProg = (props) => {
  return (
    <Box type="prog">
      <Box.Header title="Chord Progression"></Box.Header>
      <Box.Body>
        <div className="chord-progs">
          {props.myProg.length !== 0 &&
            props.myProg.map((chord, i) => {
              const selected =
                `${chord.root}${chord.formula}` ===
                `${props.myChord.root}${props.myChord.formula}`;
              return (
                <div key={i} className="prog">
                  <button
                    className={classNames("prog-name", {
                      selected,
                      active: props.playingProg === i,
                    })}
                    onClick={() => {
                      selected
                        ? props.playPiano("chord", true)
                        : props.getChord(`${chord.root}${chord.formula}`);
                    }}
                  >
                    {chord.root}
                    {chord.formula}
                  </button>
                  <button
                    className="prog-op prog-copy"
                    onClick={() => {
                      props.setMyProg({ type: "copy", index: i });
                    }}
                    disabled={props.autoplaying}
                  >
                    <Copy />
                  </button>
                  <button
                    className="prog-op prog-remove"
                    onClick={() => {
                      props.setMyProg({ type: "remove", index: i });
                    }}
                    disabled={props.autoplaying}
                  >
                    <Trash />
                  </button>
                </div>
              );
            })}

          <div className="prog">
            <button
              className="prog-add"
              onClick={() => {
                props.setMyProg({ type: "add" });
              }}
            >
              <Add />

              {`${props.myChord.root}${props.myChord.formula}`}
            </button>
          </div>
        </div>
      </Box.Body>
      <Box.Footer>
        <span></span>
        <div className="button-group touching">
          <button
            className="outline"
            onClick={() => {
              props.playPiano("prog", false);
            }}
            disabled={props.autoplaying || !props.myProg.length}
          >
            <Play />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.setMyProg({ type: "clear" });
            }}
            disabled={props.autoplaying || !props.myProg.length}
          >
            <Clear />
            <span className="text">Clear</span>
          </button>
        </div>
      </Box.Footer>
    </Box>
  );
};
