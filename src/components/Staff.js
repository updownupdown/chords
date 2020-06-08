import React from "react";
import Braces from "../icons/braces";
import Treble from "../icons/treble";
import Bass from "../icons/bass";
import Sharp from "../icons/sharp";
import Flat from "../icons/flat";
import Whole from "../icons/whole";
// import { Note } from "@tonaljs/tonal";
import "../css/staff.scss";

export const Staff = (props) => {
  const signature = props.myKey.key.keySignature;
  const accidental = signature === undefined ? undefined : signature.charAt(0);

  const sharps = ["F", "C", "G", "D", "A", "E", "B"];

  function sigList(sig) {
    let list = [];
    for (var i = 0; i < sig.length; i++) {
      list.push(
        <span
          key={i}
          className={accidental === "#" ? "sharp" : "flat"}
          title={accidental === "#" ? sharps[i] : sharps[sharps.length - i - 1]}
        >
          <span className="hover-zone"></span>
          {accidental === "#" ? <Sharp /> : <Flat />}
        </span>
      );
    }
    return list;
  }

  return (
    <div className="staffs">
      <div className="staffs-braces">
        <Braces />
      </div>
      <div className="staff staff-treble">
        <div className="clef clef-treble">
          <Treble />
        </div>
        <div className="lines">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="notes treble">
          {props.selectedNotes.map((note) => (
            <span
              key={note}
              className={`note treble note-${note
                .replace("#", "")
                .replace("b", "")} note-${note.replace("#", "s")}`}
            >
              {note.includes("b") && <Flat />}
              {note.includes("#") && <Sharp />}
              <Whole />
            </span>
          ))}
        </div>
        <div className="signature treble">
          {signature && sigList(signature)}
        </div>
      </div>
      <div className="staff staff-bass">
        <div className="clef clef-bass">
          <Bass />
        </div>
        <div className="lines">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="notes bass">
          {props.selectedNotes.map((note) => (
            <span
              key={note}
              className={`note bass note-${note
                .replace("#", "")
                .replace("b", "")} note-${note.replace("#", "s")}`}
            >
              {note.includes("b") && <Flat />}
              {note.includes("#") && <Sharp />}
              <Whole />
            </span>
          ))}
        </div>
        <div className="signature bass">{signature && sigList(signature)}</div>
      </div>
    </div>
  );
};
