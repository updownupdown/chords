import React, { useEffect, useState } from "react";
import { Note } from "@tonaljs/tonal";
import Box from "../box/Box";
import "./wave.scss";

export const Wave = (props) => {
  const [modRange, setModRange] = useState(50);
  const modInit = 0.02;
  const modZoomIn = 0.3; // smaller = can stretch wave more (decent rage: 0.2 to 0.5)
  const modStretch = 50; // smaller = can compress wave more (decent rage: 30 to 90)
  const modAmplitude = 0.085; // smaller = not as tall (percentage of canvas height)

  function drawWave() {
    // Setup canvas drawing
    var canvas = document.getElementById("wave-canvas");
    var ctx = canvas.getContext("2d");
    const frequencyMod = modInit * (modZoomIn + (100 - modRange) / modStretch);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1;

    // Get frequencies from notes
    const notes = Note.sortedNames(props.selected.notes);

    // If no notes to draw, return after clearing canvas
    if (notes.length === 0) return;

    var frequencies = [];

    for (var n = 0; n < notes.length; n++) {
      frequencies.push(Note.freq(notes[n]) * frequencyMod);
    }

    // Draw x-axis
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = "#d4dae0"; // K300
    ctx.stroke();

    // Add up frequencies and draw
    ctx.beginPath();
    ctx.lineWidth = 2;

    for (var x = 0; x <= canvas.width; x++) {
      var y = 0;

      for (var f = 0; f < frequencies.length; f++) {
        y +=
          Math.sin((frequencies[f] * x * Math.PI) / 180) *
          canvas.height *
          modAmplitude;
      }

      y += canvas.height / 2;

      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#617487"; // K650
    ctx.stroke();
  }

  useEffect(() => {
    drawWave();
  }, [props.selected, modRange]);

  return (
    <Box>
      <Box.Header title="Sound Wave"></Box.Header>
      <Box.Body>
        <div className="wave-canvas-wrap">
          {props.selected.notes.length === 0 && (
            <span className="empty">Select notes to show graph.</span>
          )}
          <canvas
            id="wave-canvas"
            className="wave-canvas"
            width="640"
            height="300"
          />
        </div>
        <input
          className="wave-slider"
          type="range"
          min={0}
          max={100}
          value={modRange}
          onChange={(e) => {
            setModRange(e.target.value);
          }}
          disabled={props.selected.notes.length === 0}
        />
      </Box.Body>
    </Box>
  );
};
