/** @jsxFrag React.Fragment */
import React, { useContext, useEffect, useState } from "react";
import { css, jsx } from "@emotion/react";
import { Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { VideoContext } from "../../context/video";
import { addToList, removeFromList } from "../api/videos";

/**
 * @function Overview
 */
const Overview = (props) => {
  const [inList, setInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const history = useHistory();
  const auth = useContext(AuthContext);
  const video = useContext(VideoContext);
  console.log("Props: ", props);
  console.log("Video State: ", video.state);

  const likeClick = (e) => {
    e.preventDefault();
    setLoadingLike(true);
    console.log("Add to liked");
    likeClick(auth.state.uid, props.metadata.vid)
      .then((result) => {
        setIsLiked(true);
        setLoadingLike(false);
        // Update liked videos context
        const likedVideos = video.state.likedVideos;
        likedVideos.push({
          ...props.metadata,
        });
        video.dispatch({
          type: "UPDATE LIKED",
          payload: {
            likedVideos: likedVideos,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  const removeLikeClick = (e) => {
    e.preventDefault();
    setLoadingLike(true);
    console.log("Remove from liked");
    removeLikeClick(auth.state.uid, props.metadata.vid)
      .then((result) => {
        setIsLiked(false);
        setLoadingLike(false);
        // Update liked videos context
        const likedVideos = video.state.likedVideos;
        const updatedLike = [];
        for (let i = 0; i < likedVideos.length; i++) {
          if (likedVideos[i].vid !== props.metadata.vid) {
            updatedLike.push(likedVideos[i]);
          }
        }
        video.dispatch({
          type: "UPDATE LIKED",
          payload: {
            likedVideos: likedVideos,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const addList = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Add to list");
    addToList(auth.state.uid, props.metadata.vid)
      .then((result) => {
        setInList(true);
        setLoading(false);
        // Update listed videos context
        const listedVideos = video.state.listedVideos;
        listedVideos.push({
          ...props.metadata,
        });
        video.dispatch({
          type: "UPDATE LISTED",
          payload: {
            listedVideos: listedVideos,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const removeList = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Remove from list");
    removeFromList(auth.state.uid, props.metadata.vid)
      .then((result) => {
        setInList(false);
        setLoading(false);
        // Update listed videos context
        const listedVideos = video.state.listedVideos;
        const updatedList = [];
        for (let i = 0; i < listedVideos.length; i++) {
          if (listedVideos[i].vid !== props.metadata.vid) {
            updatedList.push(listedVideos[i]);
          }
        }
        video.dispatch({
          type: "UPDATE LISTED",
          payload: {
            listedVideos: listedVideos,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const listedVideos = video.state.listedVideos;
    if (!listedVideos) return;
    for (let i = 0; i < listedVideos.length; i++) {
      if (listedVideos[i].vid === props.metadata.vid) {
        setInList(true);
      }
    }
  }, []);
  return (
    <div css={OverviewCSS}>
      <p>title: {props.metadata.title}</p>
      <p>description: {props.metadata.description}</p>
      <p>length: {props.metadata.length} min</p>
      <p>likes: {props.metadata.likes}</p>
      <p>dislikes: {props.metadata.dislikes}</p>
      <p>views: {props.metadata.views}</p>
      <Button
        variant="contained"
        onClick={() => history.push(`/watch/${props.metadata.vid}`)}
      >
        Play
      </Button>
      {inList ? (
        <Button disabled={loading} onClick={removeList}>
          {loading ? <>Loading...</> : <>Remove From List</>}
        </Button>
      ) : (
        <Button disabled={loading} onClick={addList}>
          {loading ? <>Loading...</> : <>Add to List</>}
        </Button>
      )}
      {isLiked ? (
        <Button disabled={loadingLike} onClick={removeLikeClick}>
          {loadingLike ? <>Loading...</> : <>Remove Like</>}
        </Button>
      ) : (
        <Button disabled={loadingLike} onClick={likeClick}>
          {loadingLike ? <>Loading...</> : <>Like</>}
        </Button>
      )}
    </div>
  );
};

const OverviewCSS = css`
  max-width: 500px;
  color: white;
  padding-top: 0.5vw;
  .Icon {
    margin-right: 10.5px;
  }
  p {
    font-size: 18px;
  }
  button {
    padding: 0.5em 2em;
    font-size: 15px;
  }
  button:first-of-type {
    background: #ff0a16;
  }
`;

export default Overview;
