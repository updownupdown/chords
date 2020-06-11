import React, { useState, useRef, useEffect } from "react";
import { Sampler, Part, Transport } from "tone";
import { Chord, Note, Key } from "@tonaljs/tonal";
import * as ChordDetect from "@tonaljs/chord-detect";
import { getRootAndFormula, sortAlpha } from "./Utils";
import { Wheel } from "./Wheel";
import { KeyChart } from "./KeyChart";
import { Piano } from "./Piano";
import { ChordChart } from "./ChordChart";
import { Menu } from "./Menu";
import { Staff } from "./Staff";
import { keyList } from "./Lists";

function Main() {
  // Default
  const defaults = {
    keyRoot: "C",
    keyType: "major",
    chordRoot: "C",
    chordFormula: "M",
  };

  // Synth
  const synth = useRef(null);
  const defaultVolume = -4;
  const [synthLoaded, setsynthLoaded] = useState(false);
  const [volume, setVolume] = useState(defaultVolume);
  const [mute, setMute] = useState(false);

  // Notes
  const [notesSelected, setNotesSelected] = useState({
    notes: [],
    type: "notes",
  });
  const [pressedNotes, setPressedNotes] = useState([]);

  // Key
  const [myKey, setMyKey] = useState({
    key: {},
    root: defaults.keyRoot,
    type: defaults.keyType,
    subtype: "",
  });
  const [showKey, setShowKey] = useState(false);

  // Chord
  const [myChord, setMyChord] = useState({
    chord: {},
    root: defaults.chordRoot,
    formula: defaults.chordFormula,
  });
  const [showChord, setShowChord] = useState(false);
  const [chordDetect, setChordDetect] = useState("");

  // Piano
  const [autoplaying, setAutoplaying] = useState(false);
  const [pianoLocked, setPianoLocked] = useState(false);
  const autoplayDelay = 0.3;
  const autoplayLength = "8n";
  const playChordDurationNote = "2n";
  const playChordDurationMs = 1000;

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
  //   console.log("volume adjust");
  //   synth.current.volume.value = volume;
  // }, [volume]);

  // useEffect(() => {
  //   console.log("mute adjust");
  //   synth.current.volume.mute = true;
  // }, [mute]);

  function hideChord() {
    setShowChord(false);
    setNotesSelected({ notes: [], type: "notes" });
  }

  function hideKey() {
    setShowKey(false);
    setNotesSelected({ notes: [], type: "notes" });
  }

  // Get chord
  function getChord(name) {
    const chord = Chord.get(name);
    if (!chord || chord.empty) {
      return;
    }

    const rootAndFormula = getRootAndFormula(chord);

    setChord(chord, rootAndFormula.root, rootAndFormula.formula);
  }

  useEffect(() => {
    getChord(`${myChord.root}${myChord.formula}`);
  }, []);

  const initChordSelection = useRef(true);

  function setChord(chord, root, formula) {
    if (initChordSelection.current) {
      initChordSelection.current = false;
    } else {
      setShowChord(true);
      selectNotesFromChord(chord.notes);
    }

    setMyChord({
      chord: chord,
      root: root,
      formula: formula,
    });
  }

  // Select notes from chord
  function selectNotesFromChord(notes) {
    !pianoLocked &&
      setNotesSelected({ notes: pitchedNotesFromChord(notes), type: "chord" });
  }

  // Select notes from key
  function selectNotesFromKey(key, type, subtype) {
    !pianoLocked &&
      setNotesSelected({
        notes: pitchedNotesFromKey(key, type, subtype),
        type: "key",
      });
  }

  // Play playlist
  function playPlaylist(playlist, pressStyle) {
    if (!synthLoaded) return;

    new Part(function (time, note) {
      synth.current.triggerAttackRelease(note.note, note.duration, time);
    }, playlist).start();
    Transport.start();

    highlightKeys(playlist, pressStyle);
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
    if (autoplaying || notesSelected.notes.length === 0) return;

    const playlist = [];
    for (var i = 0; i < notesSelected.notes.length; i++) {
      playlist.push({
        time: i * autoplayDelay,
        note: notesSelected.notes[i],
        duration: autoplayLength,
      });
    }

    playPlaylist(playlist, "scale");
  }

  // Play chord (for chords)
  function playChord() {
    if (
      Object.keys(myChord.chord).length === 0 ||
      myChord.chord.notes.length === 0
    ) {
      return;
    }

    const chord = pitchedNotesFromChord(myChord.chord.notes);

    var playlist = [
      {
        time: 0,
        note: chord,
        duration: playChordDurationNote,
      },
    ];

    playPlaylist(playlist, "chord");
  }

  // Play Scale (for keys)
  function playScale() {
    if (Object.keys(myKey.key).length === 0) {
      return;
    }

    var scale = pitchedNotesFromKey(myKey.key, myKey.type, myKey.subtype);

    const playlist = [];
    for (var i = 0; i < scale.length; i++) {
      playlist.push({
        time: i * autoplayDelay,
        note: scale[i],
        duration: autoplayLength,
      });
    }

    playPlaylist(playlist, "scale");
  }

  // Find key
  function getKey(root, type, subtype) {
    if (!root || !type) {
      setKey({}, defaults.keyNote, defaults.keyType);
      return;
    }

    var key = {};

    if (type === "major") {
      key = Key.majorKey(root);
    } else if (type === "minor") {
      key = Key.minorKey(root);
    } else {
      return;
    }

    setKey(key, root, type, subtype);
  }

  // Set key
  function setKey(key, root, type, subtype) {
    if (initKeySelection.current) {
      initKeySelection.current = false;
    } else {
      setShowKey(true);
      selectNotesFromKey(key, type, subtype);
    }

    setMyKey({ key: key, root: root, type: type, subtype: subtype });
  }

  // On init, get key but don't select it.
  useEffect(() => {
    getKey(myKey.root, myKey.type, myKey.subtype);
  }, []);

  const initKeySelection = useRef(true);

  // Press (or unpress) note
  function pressNote(note, action) {
    const list = pressedNotes;

    switch (action) {
      case "on":
        list.push(note);
        break;
      case "off":
        const index = list.indexOf(note);
        if (index > -1) {
          list.splice(index, 1);
        }
        break;
      default:
        return;
    }

    setPressedNotes(list);
  }

  // Update single selected note
  function updateNote(note, action) {
    const list = notesSelected.notes;

    switch (action) {
      case "add":
        list.push(note);
        break;
      case "remove":
        const index = list.indexOf(note);
        if (index > -1) {
          list.splice(index, 1);
        }
        break;
      default:
        return;
    }

    setNotesSelected({ notes: Note.sortedNames(list), type: "notes" });
  }

  // Update selected notes
  function updateSelected(index) {
    if (pianoLocked || autoplaying) return;

    const note = keyList[index].note;
    const enharmonic = keyList[index].enharmonic;

    if (enharmonic) {
      if (notesSelected.notes.includes(note)) {
        updateNote(note, "remove");
        updateNote(enharmonic, "add");
      } else if (notesSelected.notes.includes(enharmonic)) {
        updateNote(enharmonic, "remove");
      } else {
        updateNote(note, "add");
      }
    } else {
      if (notesSelected.notes.includes(note)) {
        updateNote(note, "remove");
      } else {
        updateNote(note, "add");
      }
    }
  }

  // Predict chords on note select change
  useEffect(() => {
    const chords = ChordDetect.detect(notesSelected.notes).sort(sortAlpha);
    setChordDetect(chords);
  }, [notesSelected]);

  // Highlight keys (for autoplay)
  function highlightKeys(playlist, pressStyle) {
    if (pressStyle === "scale") {
      var timeouts = [];

      for (let i = 0; i < playlist.length; i++) {
        setAutoplaying(true);

        timeouts.push(
          setTimeout(() => {
            setPressedNotes(playlist[i].note);
          }, autoplayDelay * i * 1000)
        );

        timeouts.push(
          setTimeout(function () {
            setPressedNotes([]);
            setAutoplaying(false);
          }, autoplayDelay * playlist.length * 1000)
        );
      }
    } else if (pressStyle === "chord") {
      setAutoplaying(true);

      setPressedNotes(playlist[0].note);

      setTimeout(function () {
        setPressedNotes([]);
        setAutoplaying(false);
      }, playChordDurationMs);
    }
  }

  // Get pitched notes from chord
  function pitchedNotesFromChord(notes) {
    var pitch = 4;
    var pitched = [];

    const octave = ["C", "D", "E", "F", "G", "A", "B"];
    var oldIndex = 0;

    for (var i = 0; i < notes.length; i++) {
      // increment after octave increases
      var newIndex = octave.indexOf(notes[i].charAt(0));
      if (newIndex < oldIndex) pitch++;
      oldIndex = newIndex;

      const simplified =
        notes[i].length > 2 ? Note.simplify(notes[i]) : notes[i];

      // need to simplify notes to get rid of things like "Bbb"
      pitched.push(simplified + pitch.toString());
    }

    return pitched;
  }

  // Get pitched notes from key/type
  function pitchedNotesFromKey(key, type, subtype) {
    var pitch = 4;
    var scale = type === "major" ? key.scale : key[subtype].scale;
    var pitched = [];

    for (var i = 0; i < scale.length; i++) {
      pitched.push(scale[i] + pitch.toString());

      if (scale[i].includes("B")) {
        pitch++;
      }
    }
    pitched.push(scale[0] + pitch.toString());

    return pitched;
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
            autoplaying={autoplaying}
            notesSelected={notesSelected}
            setNotesSelected={setNotesSelected}
            playPiano={playPiano}
            pressNote={pressNote}
            updateSelected={updateSelected}
            playNotes={playNotes}
            pianoLocked={pianoLocked}
            setPianoLocked={setPianoLocked}
            pressedNotes={pressedNotes}
            setPressedNotes={setPressedNotes}
          />

          <div className="layout-bottom">
            <div className="layout-bottom-left">
              <Wheel
                autoplaying={autoplaying}
                myChord={myChord}
                myKey={myKey}
                getKey={getKey}
                getChord={getChord}
                notesSelected={notesSelected}
                showKey={showKey}
                showChord={showChord}
              />
              <Staff myKey={myKey} notesSelected={notesSelected} />
            </div>
            <div className="layout-bottom-right">
              <KeyChart
                pianoLocked={pianoLocked}
                autoplaying={autoplaying}
                myKey={myKey}
                myChord={myChord}
                notesSelected={notesSelected}
                selectNotesFromKey={selectNotesFromKey}
                getKey={getKey}
                getChord={getChord}
                playScale={playScale}
                showKey={showKey}
                hideKey={hideKey}
              />
              <ChordChart
                pianoLocked={pianoLocked}
                autoplaying={autoplaying}
                myChord={myChord}
                notesSelected={notesSelected}
                selectNotesFromChord={selectNotesFromChord}
                getChord={getChord}
                chordDetect={chordDetect}
                playChord={playChord}
                showChord={showChord}
                hideChord={hideChord}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
