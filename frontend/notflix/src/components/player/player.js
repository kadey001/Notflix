import React, { Component } from "react";
import { css, jsx } from "@emotion/react";
import { Player } from "video-react";
import "video-react/dist/video-react.css";

import vid from "../../videos/shrek.mp4";

const file = [vid];

const VideoPlayer = () => {
  return (
    <div>
      {file.map((video) => (
        <Player src={video} />
      ))}
    </div>
  );
};
export default VideoPlayer;
