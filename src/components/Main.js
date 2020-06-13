import React, { useState, useRef, useEffect, useReducer } from "react";
import { Sampler, Part, Transport } from "tone";
import { Chord, Note, Key } from "@tonaljs/tonal";
import * as ChordDetect from "@tonaljs/chord-detect";
import {
  getRootAndFormula,
  sortAlpha,
  pitchedNotesFromChord,
  pitchedNotesFromKey,
} from "./Utils";
import { Wheel } from "./Wheel";
import { KeyChart } from "./KeyChart";
import { Piano } from "./Piano";
import { ChordChart } from "./ChordChart";
import { ChordProg } from "./ChordProg";
import { Menu } from "./Menu";
import { Staff } from "./Staff";
import { keyList } from "./Lists";

function Main() {
  // ===== Synth ===== //
  const synth = useRef(null);
  const defaultVolume = -4;
  const [synthLoaded, setsynthLoaded] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [mute, setMute] = useState(false);

  const [autoplaying, setAutoplaying] = useState(false);
  const [pianoLocked, setPianoLocked] = useState(false);

  const delayScaleMs = 300;
  const delayScaleNote = "8n";

  const delayChordMs = 1000;
  const delayChordNote = "2n";

  useEffect(() => {
    synth.current = new Sampler(
      {
        C3: "C3v8.mp3",
        C4: "C4v8.mp3",
        C5: "C5v8.mp3",
        C6: "C6v8.mp3",
        "F#3": "Fs3v8.mp3",
        "F#4": "Fs4v8.mp3",
        "F#5": "Fs5v8.mp3",
        "F#6": "Fs6v8.mp3",
        A3: "A3v8.mp3",
        A4: "A4v8.mp3",
        A5: "A5v8.mp3",
        A6: "A6v8.mp3",
      },
      {
        volume: -2,
        // mute: mute,
        release: 1.2,
        baseUrl: window.location.hostname.includes("localhost")
          ? process.env.PUBLIC_URL + "/samples/"
          : "https://updownupdown.github.io/chords/samples/",
        onload: () => {
          setsynthLoaded(true);
        },
      }
    ).toDestination();
    // Tone.context.resume();
  }, []);

  // useEffect(() => {
  //   synth.current.volume.value = volume;
  // }, [volume]);

  // useEffect(() => {
  //   synth.current.volume.mute = true;
  // }, [mute]);

  // ===== Notes ===== //
  const [selected, setSelected] = useReducer(selectedReducer, {
    notes: [],
    cat: "notes",
  });

  function selectedReducer(selected, action) {
    switch (action.type) {
      case "add":
        return { notes: [...selected.notes, action.note], cat: action.cat };
      case "remove":
        // return pressed.filter((note) => note !== action.note);
        return {
          notes: selected.notes.filter((note) => note !== action.note),
          cat: action.cat,
        };
      case "select":
        return { notes: action.notes, cat: action.cat };
      case "clear":
        return { notes: [], cat: action.cat };
      default:
        throw new Error();
    }
  }

  // Predict chords on note select change
  useEffect(() => {
    if (autoplaying) return;
    const chords = ChordDetect.detect(selected.notes).sort(sortAlpha);
    setChordDetect(chords);
  }, [selected]);

  // Toggle selected note (default/enharmonic?/off)
  function toggleNote(index) {
    if (pianoLocked || autoplaying) return;

    const note = keyList[index].note;
    const enharmonic = keyList[index].enharmonic;

    if (enharmonic) {
      if (selected.notes.includes(note)) {
        setSelected({ type: "remove", note: note, cat: "notes" });
        setSelected({ type: "add", note: enharmonic, cat: "notes" });
      } else if (selected.notes.includes(enharmonic)) {
        setSelected({ type: "remove", note: enharmonic, cat: "notes" });
      } else {
        setSelected({ type: "add", note: note, cat: "notes" });
      }
    } else {
      if (selected.notes.includes(note)) {
        setSelected({ type: "remove", note: note, cat: "notes" });
      } else {
        setSelected({ type: "add", note: note, cat: "notes" });
      }
    }
  }

  // Pressed notes on keyboard
  const [pressed, setPressed] = useReducer(pressedReducer, []);
  function pressedReducer(pressed, action) {
    switch (action.type) {
      case "add":
        return [...pressed, action.note];
      case "remove":
        return pressed.filter((note) => note !== action.note);
      case "select":
        return action.notes;
      case "clear":
        return [];
      default:
        throw new Error();
    }
  }

  // ===== Keys ===== //
  const [myKey, setMyKey] = useState({
    key: {},
    root: "C",
    type: "major",
    subtype: "",
  });

  // Find key
  function getKey(root, type, subtype) {
    var key = {};

    if (type === "major") {
      key = Key.majorKey(root);
    } else if (type === "minor") {
      key = Key.minorKey(root);
    }

    setMyKey({ key: key, root: root, type: type, subtype: subtype });

    !pianoLocked &&
      setSelected({
        type: "select",
        notes: pitchedNotesFromKey(key, type, subtype),
        cat: "key",
      });
  }

  // Get key on init
  useEffect(() => {
    getKey(myKey.root, myKey.type, myKey.subtype);
  }, []);

  // ====== Chords ===== //
  const [myChord, setMyChord] = useState({
    chord: {},
    root: "C",
    formula: "M",
  });
  const [chordDetect, setChordDetect] = useState("");

  // Get chord
  function getChord(name) {
    const chord = Chord.get(name);
    if (!chord || chord.empty) {
      return;
    }

    const rootAndFormula = getRootAndFormula(chord);

    setMyChord({
      chord: chord,
      root: rootAndFormula.root,
      formula: rootAndFormula.formula,
    });

    !pianoLocked &&
      setSelected({
        type: "select",
        notes: pitchedNotesFromChord(chord.notes),
        cat: "chord",
      });
  }

  // Run only once
  useEffect(() => {
    getChord(`${myChord.root}${myChord.formula}`);
  }, []);

  // ===== Chord Progressions ===== //
  const [myProg, setMyProg] = useReducer(progReducer, []);
  function progReducer(myProg, action) {
    switch (action.type) {
      case "add":
        return [...myProg, myChord];
      case "copy":
        return [...myProg, myProg[action.index]];
      case "remove":
        return myProg.filter((chord, i) => i !== action.index);
      case "clear":
        return [];
      default:
        throw new Error();
    }
  }

  // Play playlist
  function playPlaylist(playlist, delay, select) {
    if (!synthLoaded) return;

    new Part(function (time, note) {
      synth.current.triggerAttackRelease(note.note, note.duration, time);
    }, playlist).start();
    Transport.start();

    highlightKeys(playlist, delay, select);
  }

  // Play synth
  function playPiano(note, action, duration = "8n") {
    if (!synthLoaded) return;

    switch (action) {
      case "attack":
        synth.current.triggerAttack(note);
        break;
      case "release":
        synth.current.triggerRelease(note);
        break;
      case "attackrelease":
        synth.current.triggerAttackRelease(note, duration);
        break;
      default:
        return;
    }
  }

  // Play notes
  function playNotes() {
    if (autoplaying || selected.notes.length === 0) return;

    const sortedNotes = Note.sortedNames(selected.notes);

    const playlist = [];
    for (var i = 0; i < sortedNotes.length; i++) {
      playlist.push({
        time: (i * delayScaleMs) / 1000,
        note: sortedNotes[i],
        duration: delayScaleNote,
      });
    }

    playPlaylist(playlist, delayScaleMs);
  }

  // Play chord (for chords)
  function playChord() {
    const playlist = [
      {
        time: 0,
        note: pitchedNotesFromChord(myChord.chord.notes),
        duration: delayChordNote,
      },
    ];

    playPlaylist(playlist, delayChordMs);
  }

  // Play Scale (for keys)
  function playScale() {
    if (autoplaying || Object.keys(myKey.key).length === 0) {
      return;
    }

    var scale = pitchedNotesFromKey(myKey.key, myKey.type, myKey.subtype);

    const playlist = [];
    for (var i = 0; i < scale.length; i++) {
      playlist.push({
        time: (i * delayScaleMs) / 1000,
        note: scale[i],
        duration: delayScaleNote,
      });
    }

    playPlaylist(playlist, delayScaleMs);
  }

  // Play chord progression
  function playProg() {
    if (autoplaying || myProg.length === 0) return;

    const playlist = [];
    for (var i = 0; i < myProg.length; i++) {
      playlist.push({
        time: (i * delayChordMs) / 1000,
        note: pitchedNotesFromChord(myProg[i].chord.notes),
        duration: delayChordNote,
      });
    }

    playPlaylist(playlist, delayChordMs, true);
  }

  // Highlight keys (for autoplay)
  function highlightKeys(playlist, delay, select) {
    var timeouts = [];

    for (let i = 0; i < playlist.length; i++) {
      setAutoplaying(true);

      timeouts.push(
        setTimeout(() => {
          setPressed({ type: "select", notes: playlist[i].note });
          select &&
            setSelected({
              type: "select",
              notes: playlist[i].note,
              cat: "chord",
            });
        }, delay * i)
      );

      timeouts.push(
        setTimeout(() => {
          setPressed({ type: "clear" });
          select && setSelected({ type: "clear", cat: "chord" });
          setAutoplaying(false);
        }, delay * playlist.length)
      );
    }
  }

  return (
    <>
      <Menu />
      <div className="layout">
        {/* <div className={`loader ${synthLoaded ? "loaded" : "loading"}`}>
          <div className="loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div> */}
        <div className="layout-center">
          <Piano
            volume={volume}
            setVolume={setVolume}
            mute={mute}
            setMute={setMute}
            selected={selected}
            setSelected={setSelected}
            playPiano={playPiano}
            setPressed={setPressed}
            toggleNote={toggleNote}
            playNotes={playNotes}
            pianoLocked={pianoLocked}
            setPianoLocked={setPianoLocked}
            pressed={pressed}
          />

          <div className="layout-bottom">
            <div className="layout-bottom-left">
              <Wheel
                myChord={myChord}
                myKey={myKey}
                getKey={getKey}
                getChord={getChord}
                selected={selected}
              />
              <Staff myKey={myKey} selected={selected} />
            </div>
            <div className="layout-bottom-right">
              <KeyChart
                pianoLocked={pianoLocked}
                autoplaying={autoplaying}
                selected={selected}
                myKey={myKey}
                getKey={getKey}
                myChord={myChord}
                getChord={getChord}
                playScale={playScale}
              />
              <ChordChart
                pianoLocked={pianoLocked}
                autoplaying={autoplaying}
                selected={selected}
                myChord={myChord}
                getChord={getChord}
                playChord={playChord}
                chordDetect={chordDetect}
                setMyProg={setMyProg}
              />
              <ChordProg
                myChord={myChord}
                getChord={getChord}
                myProg={myProg}
                setMyProg={setMyProg}
                playProg={playProg}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
