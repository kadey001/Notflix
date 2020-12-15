/** @jsxFrag React.Fragment */
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { css, jsx } from "@emotion/react";
import { Button, Loader } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { VideoContext } from "../../context/video";
import { addToList, removeFromList, updateVideoLikes, updateVideoDislikes } from "../api/videos";

/**
 * @function Overview
 */
const Overview = (props) => {
  // const abortController = new AbortController();
  const [inList, setInList] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDislike, setLoadingDislike] = useState(false);
  const history = useHistory();
  const auth = useContext(AuthContext);
  const video = useContext(VideoContext);

  const likeClick = (e) => {
    e.preventDefault();
    setLoadingLike(true);
    setIsLiked(true);
    props.metadata.likes += 1;
    updateVideoLikes(auth.state.uid, props.metadata.vid, true)
      .then((result) => {
        setLoadingLike(false);
        video.dispatch({
          type: "ADD LIKED",
          payload: {
            videoMetadata: props.metadata,
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  const removeLikeClick = (e) => {
    e.preventDefault();
    setLoadingLike(true);
    setIsLiked(false);
    props.metadata.likes -= 1;
    updateVideoLikes(auth.state.uid, props.metadata.vid, false)
      .then((result) => {
        // Update liked videos context
        const likedVideos = video.state.likedVideos;
        const updatedLikedVideos = [];
        for (let i = 0; i < likedVideos.length; i++) {
          if (likedVideos[i].vid !== props.metadata.vid) {
            updatedLikedVideos.push(likedVideos[i]);
          }
        }
        video.dispatch({
          type: "REMOVE LIKED",
          payload: {
            vid: props.metadata.vid,
          },
        });
        setLoadingLike(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // TODO implement dislikes
  // const dislikeClick = (e) => {
  //   e.preventDefault();
  //   setLoadingLike(true);
  //   console.log("Add to liked");
  //   setIsLiked(true);
  //   props.metadata.likes += 1;
  //   updateVideoDislikes(auth.state.uid, props.metadata.vid, true)
  //     .then((result) => {
  //       setLoadingLike(false);
  //       // Update liked videos context
  //       const likedVideos = video.state.likedVideos;
  //       likedVideos.push({
  //         ...props.metadata,
  //       });
  //       video.dispatch({
  //         type: "UPDATE LIKED",
  //         payload: {
  //           likedVideos: likedVideos,
  //         },
  //       });
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setLoading(false);
  //     });
  // };

  // const removeDislikeClick = (e) => {
  //   e.preventDefault();
  //   setLoadingLike(true);
  //   console.log("Remove from liked");
  //   setIsLiked(false);
  //   props.metadata.likes -= 1;
  //   updateVideoDislikes(auth.state.uid, props.metadata.vid, false)
  //     .then((result) => {
  //       setLoadingLike(false);
  //       // Update liked videos context
  //       const likedVideos = video.state.likedVideos;
  //       const updatedLikedVideos = [];
  //       for (let i = 0; i < likedVideos.length; i++) {
  //         if (likedVideos[i].vid !== props.metadata.vid) {
  //           updatedLikedVideos.push(likedVideos[i]);
  //         }
  //       }
  //       video.dispatch({
  //         type: "UPDATE LIKED",
  //         payload: {
  //           likedVideos: updatedLikedVideos,
  //         },
  //       });
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setLoading(false);
  //     });
  // };

  const addList = (e) => {
    e.preventDefault();
    setLoading(true);
    addToList(auth.state.uid, props.metadata.vid)
      .then((result) => {
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
        setLoading(false);
        setInList(true);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
        } else {
          console.error(err);
          setLoading(false);
        }
      });
  };

  const removeList = (e) => {
    e.preventDefault();
    setLoading(true);
    removeFromList(auth.state.uid, props.metadata.vid)
      .then((result) => {
        setLoading(false);
        video.dispatch({
          type: "REMOVE FROM LIST",
          payload: {
            vid: props.metadata.vid
          }
        })
        setInList(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  function formatDate(date) {
    var _day = new Date(date),
      month = '' + (_day.getMonth() + 1),
      day = '' + _day.getDate(),
      year = _day.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  useEffect(() => {
    let listedVideos = video.state.listedVideos;
    if (!listedVideos) listedVideos = [];
    for (let i = 0; i < listedVideos.length; i++) {
      if (listedVideos[i].vid === props.metadata.vid) {
        setInList(true);
      }
    }
    let likedVideos = video.state.likedVideos;
    if (!likedVideos) likedVideos = [];
    for (let i = 0; i < likedVideos.length; i++) {
      if (likedVideos[i].vid === props.metadata.vid) {
        setIsLiked(true);
      }
    }
  }, []);
  return (
    <div css={OverviewCSS}>
      <p>title: {props.metadata.title}</p>
      <p>description: {props.metadata.description}</p>
      <p>released: {formatDate(Date(props.metadata.released))}</p>
      <p>length: {props.metadata.length} min</p>
      <p>likes: {props.metadata.likes}</p>
      {/* <p>dislikes: {props.metadata.dislikes}</p> */}
      <p>views: {props.metadata.views}</p>
      <Button
        variant="contained"
        onClick={() => history.push(`/watch/${props.metadata.vid}`, { vid: props.metadata.vid })}
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
      {isLiked ?
        <Button disabled={loadingLike} onClick={removeLikeClick}>
          <i
            style={{ color: "red" }}
            className={`Icon fa fa-thumbs-up`}
          />
        </Button>
        :
        <Button disabled={loadingLike} onClick={likeClick}>
          <i
            className={`Icon fa fa-thumbs-up`}
          />
        </Button>
      }
      {/* {isDisliked ? (
        <i
          style={{ padding: 15 }}
          disabled={loadingLike}
          className={`Icon fa fa-thumbs-down`}
        />
      ) : (
          <i
            style={{ padding: 15 }}
            disabled={loadingLike}
            className={`Icon fa fa-thumbs-down`}
          />
        )} */}
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
