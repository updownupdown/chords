import React from "react";
import classNames from "classnames";
import Sound from "../icons/sound";
import Clear from "../icons/clear";
import Add from "../icons/add";
import Trash from "../icons/trash";
import "../css/charts.scss";
import "../css/progs.scss";

export const Progs = (props) => {
  return (
    <div className="chart">
      <div className="chart-title">
        <div className="chart-title-progs">Chord Progression</div>
        <div className="button-group touching">
          <button
            className="outline"
            onClick={() => {
              props.playProg();
            }}
          >
            <Sound />
            <span className="text">Play</span>
          </button>
          <button
            className="outline"
            onClick={() => {
              props.setMyProg([]);
            }}
          >
            <Clear />
          </button>
        </div>
      </div>

      <div className="chart-details">
        <div className="chord-progs">
          <span className="chord-progs-list">
            {props.myProg.length === 0 ? (
              <span className="empty">No progression</span>
            ) : (
              props.myProg.map((chord, i) => (
                <div key={i} className="prog">
                  <button
                    className={classNames("chord", {
                      active:
                        `${chord.root}${chord.formula}` ===
                        `${props.myChord.root}${props.myChord.formula}`,
                    })}
                    onClick={() => {
                      props.getChord(`${chord.root}${chord.formula}`);
                    }}
                  >
                    {chord.root}
                    {chord.formula}
                  </button>
                  <button
                    className="prog-op prog-remove"
                    onClick={() => {
                      console.log("remove this prog...");
                      props.remProg(i);
                    }}
                  >
                    <Trash />
                  </button>
                </div>
              ))
            )}

            <div className="prog">
              <button
                className="chord chord-add"
                onClick={() => {
                  props.addProg();
                }}
              >
                <Add />

                {`${props.myChord.root}${props.myChord.formula}`}
              </button>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};
