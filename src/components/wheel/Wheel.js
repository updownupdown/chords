import React from "react";
import { Note } from "@tonaljs/tonal";
import classNames from "classnames";
import { WheelLines } from "./WheelLines";
import { gradesOrder, gradesNumerals } from "../../utils/Lists";
import "./wheel.scss";

export const Wheel = (props) => {
  // Get note position on wheel

  function getNoteOffset(note) {
    const noteMidiPos = {
      59: 5, // Cb4
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

  function generateNotes(root) {
    var segments = [];
    const noteOrder = [0, 1, 2, 3, 4, 5, 6, -5, -4, -3, -2, -1];
    const keyType = props.myKey.subtype
      ? props.myKey.subtype
      : props.myKey.type;

    // Generate segment data
    for (var i = 0; i < 12; i++) {
      const note = Note.transposeFifths(root, noteOrder[i]);
      const grade = gradesOrder[keyType][i].grade;
      const gradetype = gradesOrder[keyType][i].type;
      const current = root === props.myKey.root;
      const chordIndex = grade ? gradesNumerals[keyType].indexOf(grade) : false;
      const chord =
        chordIndex >= 0
          ? Object.keys(props.myKey.key).length !== 0
            ? keyType === "major"
              ? props.myKey.key.chords[chordIndex]
              : props.myKey.key[keyType].chords[chordIndex]
            : false
          : false;

      segments.push({
        note: note,
        grade: grade !== undefined ? grade : "none",
        gradetype: gradetype !== undefined ? gradetype : "none",
        chord: chord,
        current: current,
      });
    }

    // Rotate segments
    const offset = -getNoteOffset(root);
    const offsetSegments = arrayRotate(segments, offset);

    // Generate segments
    return (
      <>
        <svg
          className="arc-sections"
          width="402"
          height="402"
          viewBox="0 0 402 402"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {offsetSegments.map((segment, i) => {
            const currentKey = root === segment.note;
            const currentChord =
              props.myChord.chord.symbol !== undefined &&
              props.myChord.chord.symbol === segment.chord;

            return (
              <g key={i}>
                <path
                  className={classNames(
                    `outer outer-${i} type-${segment.gradetype}`,
                    {
                      current: currentKey,
                      "in-key": segment.gradetype !== "none",
                    }
                  )}
                  d={arcPaths[i].outer}
                  onClick={() => {
                    currentKey
                      ? props.playPiano("scale", false)
                      : props.getKey(
                          Note.simplify(segment.note),
                          props.myKey.type,
                          props.myKey.subtype
                        );
                  }}
                />
                {segment.gradetype !== "none" && (
                  <path
                    className={classNames(
                      `inner inner-${i} type-${segment.gradetype}`,
                      {
                        current: currentChord,
                      }
                    )}
                    d={arcPaths[i].inner}
                    onClick={() => {
                      currentChord
                        ? props.playPiano("chord", true)
                        : props.getChord(segment.chord);
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
        {offsetSegments.map((segment, i) => (
          <span key={i} data-note={segment.note}>
            <span
              className={classNames(
                `note note-${i} type-${segment.gradetype}`,
                {
                  current: root === segment.note,
                  "in-key": segment.gradetype !== "none",
                }
              )}
            >
              {stylize(segment.note)}
            </span>

            {segment.grade && (
              <span className={`grade grade-${i}`}>{segment.grade}</span>
            )}
          </span>
        ))}
      </>
    );
  }

  return (
    <div className="wheel-wrap">
      <div
        className={classNames("wheel", {
          [`theme-${props.selected.cat}`]: true,
        })}
      >
        {generateNotes(props.myKey.root)}

        <WheelLines showChord={props.showChord} myChord={props.myChord} />
      </div>
      <div className="wheel-background"></div>
    </div>
  );
};

const arcPaths = [
  {
    outer:
      "M252.764 7.81486C218.853 -1.2716 183.147 -1.27162 149.236 7.81481L167.354 75.4296C189.396 69.5234 212.604 69.5235 234.647 75.4297L252.764 7.81486Z",
    inner:
      "M234.646 75.4297C212.604 69.5235 189.396 69.5234 167.354 75.4296L179.13 119.379C193.457 115.54 208.543 115.54 222.87 119.379L234.646 75.4297Z",
  },
  {
    outer:
      "M342.421 59.5785C317.597 34.7539 286.675 16.9012 252.764 7.8147L234.646 75.4295C256.689 81.3357 276.788 92.94 292.924 109.076L342.421 59.5785Z",
    inner:
      "M292.924 109.076C276.788 92.9399 256.689 81.3356 234.646 75.4294L222.87 119.379C237.198 123.218 250.262 130.761 260.75 141.249L292.924 109.076Z",
  },
  {
    outer:
      "M394.185 149.236C385.099 115.325 367.246 84.4033 342.421 59.5786L292.924 109.076C309.06 125.212 320.664 145.311 326.57 167.353L394.185 149.236Z",
    inner:
      "M326.57 167.353C320.664 145.311 309.06 125.212 292.924 109.076L260.75 141.249C271.239 151.738 278.782 164.802 282.621 179.13L326.57 167.353Z",
  },
  {
    outer:
      "M394.185 252.764C403.272 218.853 403.272 183.147 394.185 149.236L326.57 167.354C332.477 189.396 332.477 212.604 326.57 234.647L394.185 252.764Z",
    inner:
      "M326.57 234.646C332.476 212.604 332.476 189.396 326.57 167.354L282.621 179.13C286.46 193.457 286.46 208.543 282.621 222.87L326.57 234.646Z",
  },
  {
    outer:
      "M342.421 342.421C367.246 317.597 385.099 286.675 394.185 252.764L326.57 234.646C320.664 256.689 309.06 276.788 292.924 292.924L342.421 342.421Z",
    inner:
      "M292.924 292.924C309.06 276.788 320.664 256.689 326.57 234.646L282.621 222.87C278.782 237.198 271.239 250.262 260.75 260.75L292.924 292.924Z",
  },
  {
    outer:
      "M252.764 394.185C286.675 385.099 317.596 367.246 342.421 342.421L292.924 292.924C276.788 309.06 256.688 320.664 234.646 326.57L252.764 394.185Z",
    inner:
      "M234.646 326.57C256.689 320.664 276.788 309.06 292.924 292.924L260.75 260.75C250.262 271.239 237.198 278.782 222.87 282.621L234.646 326.57Z",
  },
  {
    outer:
      "M149.236 394.185C183.147 403.272 218.853 403.272 252.764 394.185L234.646 326.57C212.604 332.477 189.396 332.477 167.353 326.57L149.236 394.185Z",
    inner:
      "M167.353 326.57C189.395 332.476 212.604 332.476 234.646 326.57L222.87 282.621C208.543 286.46 193.457 286.46 179.13 282.621L167.353 326.57Z",
  },
  {
    outer:
      "M59.5786 342.421C84.4032 367.246 115.325 385.098 149.236 394.185L167.353 326.57C145.311 320.664 125.212 309.06 109.076 292.924L59.5786 342.421Z",
    inner:
      "M109.076 292.924C125.212 309.06 145.311 320.664 167.353 326.57L179.13 282.62C164.802 278.781 151.738 271.239 141.249 260.75L109.076 292.924Z",
  },
  {
    outer:
      "M7.8147 252.764C16.9011 286.675 34.7538 317.596 59.5785 342.421L109.076 292.924C92.94 276.788 81.3357 256.688 75.4295 234.646L7.8147 252.764Z",
    inner:
      "M75.4294 234.646C81.3356 256.689 92.9399 276.788 109.076 292.924L141.249 260.75C130.761 250.262 123.218 237.198 119.379 222.87L75.4294 234.646Z",
  },
  {
    outer:
      "M7.81486 149.236C-1.2716 183.147 -1.27162 218.853 7.81481 252.764L75.4296 234.646C69.5234 212.604 69.5235 189.396 75.4297 167.353L7.81486 149.236Z",
    inner:
      "M75.4297 167.354C69.5235 189.396 69.5234 212.604 75.4296 234.646L119.379 222.87C115.54 208.543 115.54 193.457 119.379 179.13L75.4297 167.354Z",
  },
  {
    outer:
      "M59.5788 59.5786C34.7541 84.4032 16.9014 115.325 7.81494 149.236L75.4297 167.353C81.3359 145.311 92.9402 125.212 109.076 109.076L59.5788 59.5786Z",
    inner:
      "M109.076 109.076C92.9402 125.212 81.3359 145.311 75.4297 167.354L119.379 179.13C123.218 164.802 130.761 151.738 141.25 141.25L109.076 109.076Z",
  },
  {
    outer:
      "M149.236 7.8147C115.325 16.9011 84.4033 34.7538 59.5786 59.5785L109.076 109.076C125.212 92.94 145.311 81.3357 167.353 75.4295L149.236 7.8147Z",
    inner:
      "M167.354 75.4294C145.311 81.3356 125.212 92.9399 109.076 109.076L141.25 141.249C151.738 130.761 164.802 123.218 179.13 119.379L167.354 75.4294Z",
  },
];
