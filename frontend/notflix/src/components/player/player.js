import React, { Component } from "react";
import { css, jsx } from "@emotion/react";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { useParams } from "react-router-dom";

import vid from "../../videos/shrek.mp4";

const file = [vid];

const VideoPlayer = () => {
  const { vid } = useParams();
  return (
    <div>
      <Player />
    </div>
  );
};
export default VideoPlayer;
