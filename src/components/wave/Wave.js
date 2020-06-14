import React from "react";
import Box from "../box/Box";
import { WaveCanvas } from "./WaveCanvas";
import "./wave.scss";

export const Wave = (props) => {
  return (
    <Box id="wave" title="Sound Wave" openByDefault={false}>
      <Box.Body>
        <WaveCanvas selected={props.selected} playPiano={props.playPiano} />
      </Box.Body>
    </Box>
  );
};
