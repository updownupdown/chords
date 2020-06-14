import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { Chord } from "@tonaljs/tonal";
import { chordList } from "../../utils/Lists";
import { Picker } from "../common/Picker";
import { trimChordRoot } from "../../utils/Utils";
import { NotesIntervals } from "../common/NotesIntervals";
import Piano from "../../icons/piano";
import Play from "../../icons/play";
import Search from "../../icons/search";
import Box from "../box/Box";
import "./chords.scss";

export const Chords = (props) => {
  const [chordSearch, setChordSearch] = useState("");
  const [chordResult, setChordResult] = useState({ empty: true });

  useEffect(() => {
    const searchResults = Chord.get(chordSearch);
    setChordResult(searchResults);
  }, [chordSearch]);

  const octave = ["C", "D", "E", "F", "G", "A", "B"];

  const noteChoices = octave.map((note, i) => (
    <span key={i} className="note">
      <button
        className="natural"
        onClick={() => {
          props.getChord(`${note}${props.myChord.formula}`);
        }}
      >
        {note}
      </button>
      <button
        className="flat"
        onClick={() => {
          props.getChord(`${note}b${props.myChord.formula}`);
        }}
      >
        {note}b
      </button>
      <button
        className="sharp"
        onClick={() => {
          props.getChord(`${note}#${props.myChord.formula}`);
        }}
      >
        {note}#
      </button>
    </span>
  ));

  const chordChoices = (
    <>
      {Object.keys(chordList).map((item, i) => (
        <span key={i} className="type-group">
          <span className="type-group-title">{chordList[item].name}</span>
          <span className="type-group-options">
            {chordList[item].options.map((chord, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                    props.getChord(`${props.myChord.root}${chord.formula}`);
                  }}
                >
                  {chord.name}
                </button>
              );
            })}
          </span>
        </span>
      ))}
    </>
  );

  // Format Chord Type
  function formatChordName(type) {
    function replaceAll(str, mapObj) {
      const replace = new RegExp(Object.keys(mapObj).join("|"), "gi");

      return str.replace(replace, function (matched) {
        return mapObj[matched.toLowerCase()];
      });
    }

    const formattedType = replaceAll(type, chordStringSubs);
    return formattedType;
  }

  const chordStringSubs = {
    second: "2nd",
    third: "3rd",
    fourth: "4th",
    fifth: "5th",
    sixth: "6th",
    seventh: "7th",
    eight: "8th",
    ninth: "9th",
    eleventh: "11th",
    twelfth: "12th",
    thirteenth: "13th",
  };

  return (
    <Box id="chord" title="Chord" openByDefault={true}>
      <Box.Menu>
        <div className="picker-group theme-chord">
          <Picker className="picker-notes" selected={props.myChord.root}>
            <div className="picker-notes-menu">{noteChoices}</div>
          </Picker>
          <Picker
            className="picker-chords"
            selected={
              // chord.type has nicer format than formula, use if possible
              props.myChord.chord.type
                ? formatChordName(props.myChord.chord.type)
                : formatChordName(props.myChord.formula)
            }
          >
            <div className="picker-chords-menu">{chordChoices}</div>
          </Picker>
        </div>
        <div className="button-group touching">
          <button
            className="small-on-mobile"
            onClick={() => {
              props.getChord(`${props.myChord.root}${props.myChord.formula}`);
            }}
            disabled={
              props.autoplaying ||
              props.pianoLocked ||
              (props.selected.cat === "chord" &&
                Object.keys(props.myChord.chord).length !== 0)
            }
          >
            <Piano />
            <span className="text">Select</span>
          </button>
          <button
            className="small-on-mobile"
            onClick={() => {
              props.playPiano("chord", true);
            }}
            disabled={
              props.autoplaying || Object.keys(props.myChord.chord).length === 0
            }
          >
            <Play />
            <span className="text">Play</span>
          </button>
        </div>
      </Box.Menu>
      <Box.Body>
        {Object.keys(props.myChord.chord).length && (
          <>
            <NotesIntervals
              playPiano={props.playPiano}
              notes={props.myChord.chord["notes"]}
              intervals={props.myChord.chord["intervals"]}
            />
          </>
        )}

        <div className="chord-search-wrap">
          <div
            className={classNames("chord-search", {
              "has-results": !chordResult.empty,
            })}
          >
            <Search />
            <input
              className="chord-search-input"
              type="text"
              value={chordSearch}
              onChange={(e) => {
                setChordSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                console.log(chordResult);
                if (e.key === "Enter" && !chordResult.empty) {
                  props.getChord(chordResult.symbol);
                }
              }}
              placeholder="Cm, F7b9..."
            />
            <div className="chord-search-result">
              {chordResult.empty ? (
                <span className="empty">No chord found.</span>
              ) : (
                <>
                  <span
                    role="button"
                    className="theme-chord"
                    onClick={() => {
                      props.getChord(chordResult.symbol);
                    }}
                  >
                    {formatChordName(chordResult.name)}
                  </span>
                  <span className="type-enter">Type Enter to select</span>
                </>
              )}
            </div>
          </div>
        </div>
      </Box.Body>
      <Box.Footer className="box-footer-chord">
        <div className="chord-aliases">
          {props.myChord.chord["aliases"].map((alias, i) => {
            if (alias === "") return "";
            var formatted = i !== 0 ? ", " : "";
            formatted += props.myChord.chord["notes"][0] + alias;
            return formatted;
          })}
        </div>
        <div className="predicted-chords">
          {props.chordDetect.length > 0 ? (
            <div className="button-group">
              {props.chordDetect.map((chord, i) => (
                <button
                  key={i}
                  className="button small theme-chord"
                  onClick={() => {
                    props.getChord(trimChordRoot(chord));
                  }}
                  disabled={
                    trimChordRoot(chord) ===
                    `${props.myChord.root}${props.myChord.formula}`
                  }
                >
                  {trimChordRoot(chord)}
                </button>
              ))}
            </div>
          ) : (
            <span className="predicted-chords-empty">
              No chords detected from selected keys.
            </span>
          )}
        </div>
      </Box.Footer>
    </Box>
  );
};
