import React, { Component } from "react";
import { css, jsx } from "@emotion/react";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";
import { useParams } from "react-router-dom";
import { countView } from "../api/videos";

// import video from "../../videos/shrek.mp4";

const VideoPlayer = () => {
  const { vid } = useParams();

  const handleVideoMounted = (element) => {
    if (element !== null) {
      console.log(element);
      element.actions.handleEnd = () => {
        countView(vid).then((result) => {
          console.log(result);
        });
      }
    }
  };
  return (
    <div style={{ paddingTop: "68px" }}>
      <Player
        src={`http://13.77.174.221:3001/video/view?vid=${vid}`}
        ref={handleVideoMounted}
      >
        <BigPlayButton position="center" />
      </Player>
    </div>
  );
};
export default VideoPlayer;
