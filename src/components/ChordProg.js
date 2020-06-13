import React from "react";
import classNames from "classnames";
import Sound from "../icons/sound";
import Clear from "../icons/clear";
import Add from "../icons/add";
import Trash from "../icons/trash";
import Copy from "../icons/copy";
import "../css/charts.scss";
import "../css/chord-prog.scss";

export const ChordProg = (props) => {
  return (
    <div className="chart">
      <div className="chart-title">
        <div className="chart-title-progs">Chord Progression</div>
        <div className="button-group touching">
          <button
            className="outline"
            onClick={() => {
              props.playPiano("prog", false);
            }}
            disabled={!props.myProg.length}
          >
            <Sound />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.setMyProg({ type: "clear" });
            }}
            disabled={!props.myProg.length}
          >
            <Clear />
            <span className="text">Clear</span>
          </button>
        </div>
      </div>

      <div className="chart-details">
        <div className="chord-progs">
          {props.myProg.length !== 0 &&
            props.myProg.map((chord, i) => (
              <div key={i} className="prog">
                <button
                  className={classNames("prog-name", {
                    selected:
                      `${chord.root}${chord.formula}` ===
                      `${props.myChord.root}${props.myChord.formula}`,
                    active: props.playingProg === i,
                  })}
                  onClick={() => {
                    props.getChord(`${chord.root}${chord.formula}`);
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
            ))}

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
      </div>
    </div>
  );
};
