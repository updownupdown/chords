import React, { useState, useRef, useEffect } from "react";
import { Sampler, Part, Transport } from "tone";
import { Chord, Note, Key } from "@tonaljs/tonal";
import * as ChordDetect from "@tonaljs/chord-detect";
import { Wheel } from "./Wheel";
import { KeyChart } from "./KeyChart";
import { Keyboard } from "./Keyboard";
import { ChordChart } from "./ChordChart";
import { Menu } from "./Menu";
import { Staff } from "./Staff";
import { keyList } from "./Lists";

// Keyboard
function Layout() {
  const [pianoLoaded, setPianoLoaded] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const [notesSelected, setNotesSelected] = useState({
    notes: [],
    type: "notes",
  });

  const [pressedNotes, setPressedNotes] = useState([]);
  const [chordDetect, setChordDetect] = useState("");
  const [myKey, setMyKey] = useState({ key: {}, note: "", type: "" });
  const [chosenChord, setChosenChord] = useState({ chord: {}, name: "" });

  const [autoplaying, setAutoplaying] = useState(false);
  const [keyboardLocked, setKeyboardLocked] = useState(false);

  // for auto play keys
  const autoplayDelay = 0.3;
  const autoplayLength = "8n";

  const piano = useRef(null);

  useEffect(() => {
    piano.current = new Sampler(
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
        volume: 0,
        release: 1.2,
        baseUrl: window.location.hostname.includes("localhost")
          ? process.env.PUBLIC_URL + "/samples/"
          : "https://www.jamescarmichael.ca/chords/samples/",
        onload: () => {
          setPianoLoaded(true);
        },
      }
    ).toDestination();
    // piano.current.volume.value = -5;
    // Tone.context.resume();
  }, []);

  function getChord(name) {
    const chord = Chord.get(name);
    selectChord(chord, name);
  }

  function selectChord(chord, name) {
    // hack to unselect chord
    if (chord.empty) {
      setChosenChord({ chord: {}, name: "" });

      if (notesSelected.type === "chord") {
        setNotesSelected({ notes: [], type: "chord" });
      }

      return;
    }

    setChosenChord({ chord: chord, name: name });

    !keyboardLocked && selectChordNotes(chord);
  }

  function selectChordNotes(chord) {
    setNotesSelected({
      notes: pitchedNotesFromChord(chord.notes),
      type: "chord",
    });
  }

  function playPlaylist(playlist, pressStyle) {
    if (!pianoLoaded) return;

    new Part(function (time, note) {
      piano.current.triggerAttackRelease(note.note, note.duration, time);
    }, playlist).start();
    Transport.start();

    highlightKeys(playlist, pressStyle);
  }

  function playPiano(note, action, duration = "8n") {
    if (!pianoLoaded) return;

    switch (action) {
      case "attack":
        piano.current.triggerAttack(note);
        break;
      case "release":
        piano.current.triggerRelease(note);
        break;
      case "attackrelease":
        piano.current.triggerAttackRelease(note, duration);
      default:
        break;
    }
  }

  function pianoAttack(note) {
    pianoLoaded && piano.current.triggerAttack(note);
  }
  function pianoRelease(note) {
    pianoLoaded && piano.current.triggerRelease(note);
  }
  function pianoAttackRelease(note, duration) {
    pianoLoaded && piano.current.triggerAttackRelease(note, duration);
  }

  function setKey(key, note, type) {
    if (!key || !note || !type) {
      setMyKey({ key: {}, note: "", type: "" });

      if (notesSelected.type === "key") {
        setNotesSelected({ notes: [], type: "key" });
      }

      return;
    }

    setMyKey({ key: key, note: note, type: type });

    !keyboardLocked && selectNotesFromKey(key, type);
  }

  function selectNotesFromKey(key, type) {
    setNotesSelected({ notes: pitchedScale(key, type), type: "key" });
  }

  function findKey(note, type) {
    if (!note || !type) {
      setKey({}, "", "");
      return;
    }

    var key = {};

    if (type === "major") {
      key = Key.majorKey(note);
    } else if (type === "minor") {
      key = Key.minorKey(note);
    } else {
      return;
    }

    setKey(key, note, type);
  }

  function setLeftButtonState(e) {
    setMouseDown(e.buttons === undefined ? e.which === 1 : e.buttons === 1);
  }
  document.body.onmousedown = setLeftButtonState;
  document.body.onmouseup = setLeftButtonState;

  function addNote(note) {
    const list = notesSelected.notes;
    list.push(note);
    setNotesSelected({ notes: Note.sortedNames(list), type: "notes" });
  }
  function removeNote(note) {
    const list = notesSelected.notes;
    const index = list.indexOf(note);
    if (index > -1) {
      list.splice(index, 1);
    }

    setNotesSelected({ notes: Note.sortedNames(list), type: "notes" });
  }

  function pressNote(note) {
    const list = pressedNotes;
    list.push(note);
    setPressedNotes(list);
  }
  function unpressNote(note) {
    const list = pressedNotes;
    const index = list.indexOf(note);
    if (index > -1) {
      list.splice(index, 1);
    }
    setPressedNotes(list);
  }

  // Update selected notes
  function updateSelected(index) {
    if (keyboardLocked || autoplaying) return;

    const note = keyList[index].note;
    const enharmonic = keyList[index].enharmonic;

    if (enharmonic) {
      if (notesSelected.notes.includes(note)) {
        removeNote(note, false);
        addNote(enharmonic, true);
      } else if (notesSelected.notes.includes(enharmonic)) {
        removeNote(enharmonic, false);
      } else {
        addNote(note, true);
      }
    } else {
      if (notesSelected.notes.includes(note)) {
        removeNote(note, true);
      } else {
        addNote(note, true);
      }
    }

    // Predict chords
    const chords = ChordDetect.detect(notesSelected.notes);
    setChordDetect(chords);
  }

  function clearSelected() {
    setChordDetect("");
    setNotesSelected({ notes: [], type: "notes" });
  }

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
      }, 2000);
    }
  }

  function scaleFromKey(key, type) {
    if (type === "major") {
      return key.scale;
    } else if (type === "minor") {
      return key.natural.scale;
    }
    return;
  }

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

  function pitchedScale(key, type) {
    var pitch = 4;
    var scale = scaleFromKey(key, type);
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

  function playSelectedKeys() {
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

  function playChord() {
    if (
      Object.keys(chosenChord.chord).length === 0 ||
      chosenChord.chord.notes.length === 0
    ) {
      return;
    }

    const chord = pitchedNotesFromChord(chosenChord.chord.notes);

    var playlist = [
      {
        time: 0,
        note: chord,
        duration: "1n",
      },
    ];
    playPlaylist(playlist, "chord");
  }

  function playScale() {
    if (Object.keys(myKey.key).length === 0) {
      return;
    }

    var scale = pitchedScale(myKey.key, myKey.type);

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

  return (
    <>
      <Menu
        notesSelected={notesSelected}
        clearSelected={clearSelected}
        playSelectedKeys={playSelectedKeys}
      />
      <div className="layout">
        {/* <div className={`loader ${pianoLoaded ? "loaded" : "loading"}`}>
          <div className="loading">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div> */}
        <div className="layout-center">
          <Keyboard
            autoplaying={autoplaying}
            mouseDown={mouseDown}
            notesSelected={notesSelected}
            playPiano={playPiano}
            pressNote={pressNote}
            unpressNote={unpressNote}
            updateSelected={updateSelected}
            clearSelected={clearSelected}
            playSelectedKeys={playSelectedKeys}
            keyboardLocked={keyboardLocked}
            setKeyboardLocked={setKeyboardLocked}
            pressedNotes={pressedNotes}
            setPressedNotes={setPressedNotes}
          />

          <div className="layout-bottom">
            <div className="layout-bottom-left">
              <Wheel
                autoplaying={autoplaying}
                chosenChord={chosenChord}
                myKey={myKey}
                findKey={findKey}
                playScale={playScale}
              />
              <Staff myKey={myKey} notesSelected={notesSelected} />
            </div>
            <div className="layout-bottom-right">
              <KeyChart
                keyboardLocked={keyboardLocked}
                autoplaying={autoplaying}
                myKey={myKey}
                notesSelected={notesSelected}
                selectNotesFromKey={selectNotesFromKey}
                getChord={getChord}
                findKey={findKey}
                playScale={playScale}
              />
              <ChordChart
                keyboardLocked={keyboardLocked}
                autoplaying={autoplaying}
                chosenChord={chosenChord}
                notesSelected={notesSelected}
                selectNotesFromKey={selectNotesFromKey}
                getChord={getChord}
                selectChordNotes={selectChordNotes}
                chordDetect={chordDetect}
                playChord={playChord}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
