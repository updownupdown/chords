import React, { useState, useRef, useEffect } from "react";
import { Sampler, Part, Transport } from "tone";
import { Chord, Note, Key } from "@tonaljs/tonal";
import * as ChordDetect from "@tonaljs/chord-detect";
import { Wheel } from "./Wheel";
import { KeyChart } from "./KeyChart";
import { Piano } from "./Piano";
import { ChordChart } from "./ChordChart";
import { Menu } from "./Menu";
import { Staff } from "./Staff";
import { keyList } from "./Lists";

function Layout() {
  const [synthLoaded, setsynthLoaded] = useState(false);

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

  const synth = useRef(null);

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
        volume: 0,
        release: 1.2,
        baseUrl: window.location.hostname.includes("localhost")
          ? process.env.PUBLIC_URL + "/samples/"
          : "https://updownupdown.github.io/chords/samples/",
        onload: () => {
          setsynthLoaded(true);
        },
      }
    ).toDestination();
    // synth.current.volume.value = -5;
    // Tone.context.resume();
  }, []);

  // Get chord
  function getChord(name) {
    const chord = Chord.get(name);

    // hack to unselect chord
    if (chord.empty) {
      setChosenChord({ chord: {}, name: "", notes: [] });

      if (notesSelected.type === "chord") {
        setNotesSelected({ notes: [], type: "chord" });
      }

      return;
    }

    setChosenChord({ chord: chord, name: name });

    selectNotesFromChord(chord.notes);
  }

  // Select notes from chord
  function selectNotesFromChord(notes) {
    !keyboardLocked &&
      setNotesSelected({ notes: pitchedNotesFromChord(notes), type: "chord" });
  }

  // Select notes from key
  function selectNotesFromKey(key, type) {
    !keyboardLocked &&
      setNotesSelected({ notes: pitchedNotesFromKey(key, type), type: "key" });
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
      default:
        break;
    }
  }

  // Find key
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

  // Set key
  function setKey(key, note, type) {
    if (!key || !note || !type) {
      setMyKey({ key: {}, note: "", type: "" });

      if (notesSelected.type === "key") {
        setNotesSelected({ notes: [], type: "key" });
      }

      return;
    }

    setMyKey({ key: key, note: note, type: type });

    selectNotesFromKey(key, type);
  }

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
    if (keyboardLocked || autoplaying) return;

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
    const chords = ChordDetect.detect(notesSelected.notes);
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
      }, 2000);
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
  function pitchedNotesFromKey(key, type) {
    var pitch = 4;
    var scale = type === "major" ? key.scale : key.natural.scale;
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

  // Play Scale (for keys)
  function playScale() {
    if (Object.keys(myKey.key).length === 0) {
      return;
    }

    var scale = pitchedNotesFromKey(myKey.key, myKey.type);

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
            autoplaying={autoplaying}
            notesSelected={notesSelected}
            setNotesSelected={setNotesSelected}
            playPiano={playPiano}
            pressNote={pressNote}
            updateSelected={updateSelected}
            playNotes={playNotes}
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
                notesSelected={notesSelected}
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
                findKey={findKey}
                getChord={getChord}
                playScale={playScale}
              />
              <ChordChart
                keyboardLocked={keyboardLocked}
                autoplaying={autoplaying}
                chosenChord={chosenChord}
                notesSelected={notesSelected}
                selectNotesFromChord={selectNotesFromChord}
                getChord={getChord}
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
