import React from "react";
import { Note } from "@tonaljs/tonal";
import classNames from "classnames";
import { WheelLines } from "./WheelLines";
import { gradesOrder, gradesNumerals } from "./Utils";
import Spoke from "../icons/spoke";
import "../css/wheel.scss";

export const Wheel = (props) => {
  // Get note position on wheel

  function getNoteOffset(note) {
    const noteMidiPos = {
      72: 0, // C4
      60: 0, // B#4
      67: 1,
      62: 2,
      69: 3,
      64: 4,
      71: 5,
      66: 6,
      61: 7,
      68: 8,
      63: 9,
      70: 10,
      65: 11,
    };

    return noteMidiPos[Note.midi(Note.simplify(note + "4"))];
  }

  function arrayRotate(arr, count) {
    count -= arr.length * Math.floor(count / arr.length);
    arr.push.apply(arr, arr.splice(0, count));
    return arr;
  }

  function stylize(note) {
    const noteClass = note.includes("#")
      ? "sharp"
      : note.includes("b")
      ? "flat"
      : "natural";

    return (
      <span className={noteClass}>
        <span>{note.charAt(0)}</span>
        <span>{note.substr(1)}</span>
      </span>
    );
  }

  // Generate notes around wheel
  function generateNotes(root) {
    const offset = -getNoteOffset(root);
    const order = [0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1];
    const rotatedOrder = arrayRotate(order, offset);
    const type = props.myKey.subtype ? props.myKey.subtype : props.myKey.type;

    return rotatedOrder.map((t, i) => {
      const note = Note.transposeFifths(root, t);
      const gradeType = gradesOrder[type][i].type;
      const gradeGrade = gradesOrder[type][(i + offset + 24) % 12].grade;
      const chordIndex = gradesNumerals[type].indexOf(gradeGrade);

      return (
        <span key={i} data-note={note}>
          <span
            className={classNames(`note note-${i}`, {
              current: root === note,
              "in-key": gradeGrade,
            })}
            role="button"
            onClick={() => {
              props.getKey(
                Note.simplify(note),
                props.myKey.type,
                props.myKey.subtype
              );
            }}
          >
            {stylize(note)}
          </span>
          <span
            className={classNames(`spoke spoke-${gradeType}`, {
              "spoke-current": i === 0,
            })}
            style={{ transform: `rotate(${(i - offset) * 30}deg)` }}
          >
            <Spoke />
          </span>
          {gradeGrade && (
            <span
              className={`grade grade-${i}`}
              role="button"
              onClick={() => {
                props.getChord(props.myKey.key.chords[chordIndex]);
              }}
            >
              {gradeGrade}
            </span>
          )}
        </span>
      );
    });
  }

  return (
    <div
      className={classNames("wheel", {
        [`theme-${props.notesSelected.type}`]: true,
      })}
    >
      {generateNotes(props.myKey.root)}

      <div className="wheel-background"></div>

      <WheelLines showChord={props.showChord} myChord={props.myChord} />
    </div>
  );
};
