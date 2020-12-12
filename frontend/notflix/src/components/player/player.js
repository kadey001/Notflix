import React, { Component } from "react";
import { css, jsx } from "@emotion/react";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { useParams } from "react-router-dom";

// import video from "../../videos/shrek.mp4";

const VideoPlayer = () => {
  const { vid } = useParams();
  return (
    <div style={{ paddingTop: "68px" }}>
      <Player src={`http://13.77.174.221:3001/video/view?vid=${vid}`} />
    </div>
  );
};
export default VideoPlayer;
