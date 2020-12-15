import React, { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { getCommentLikesDislikes, getComments, updateCommentLikes, updateCommentDislikes } from "../../../components/api/videos";
import { AuthContext } from "../../../context/auth";

const Comments = ({ vid, reducer }) => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [commentLikesDislikes, setCommentLikesDislikes] = useState(null);
  const [comments, setComments] = useState([]);

  const toggleCommentLike = (cid) => {
    const updatedList = [];
    commentLikesDislikes.forEach((comment) => {
      if (comment.cid === cid) {
        updatedList.push({
          ...comment,
          liked: !comment.liked
        });
      } else {
        updatedList.push(comment);
      }
    });
    console.log(updatedList);
    setCommentLikesDislikes(updatedList);
  }

  const handleLike = (cid, increment) => {
    if (loading) return;
    if (increment && checkCommentLiked(cid)) return;
    if (!increment && !checkCommentLiked(cid)) return;
    setLoading(true);
    toggleCommentLike(cid);
    updateCommentLikes(cid, auth.state.uid, increment).then(() => {
      refreshComments();
      refreshCommentLikesDislikes();
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }

  const toggleCommentDislike = (cid) => {
    const updatedList = [];
    commentLikesDislikes.forEach((comment) => {
      if (comment.cid === cid) {
        updatedList.push({
          ...comment,
          disliked: !comment.disliked
        });
      } else {
        updatedList.push(comment);
      }
    });
    console.log(updatedList);
    setCommentLikesDislikes(updatedList);
  }

  const handleDislike = (cid, increment) => {
    if (loading) return;
    if (increment && checkCommentDisliked(cid)) return;
    if (!increment && !checkCommentDisliked(cid)) return;
    console.log('Handle Dislike');
    setLoading(true);
    toggleCommentDislike(cid);
    updateCommentDislikes(cid, auth.state.uid, increment).then((result) => {
      console.log(result);
      refreshComments();
      refreshCommentLikesDislikes();
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }

  const checkCommentLiked = (cid) => {
    if (!commentLikesDislikes) { console.log('CommentLikesDislikes Undefined.'); return false; };
    let liked = false;
    commentLikesDislikes.forEach((comment) => {
      if (comment.cid === cid) {
        if (comment.liked) liked = true;
      }
    });
    return liked;
  }

  const checkCommentDisliked = (cid) => {
    if (!commentLikesDislikes) { console.log('CommentLikesDislikes Undefined.'); return false; };
    let disliked = false;
    commentLikesDislikes.forEach((comment) => {
      if (comment.cid === cid) {
        if (comment.disliked) disliked = true;
      }
    });
    return disliked;
  }

  const refreshCommentLikesDislikes = () => {
    getCommentLikesDislikes(auth.state.uid, vid).then((result) => {
      console.log(result.data);
      setCommentLikesDislikes(result.data);
    }).catch((err) => {
      console.error(err);
    });
  }

  const refreshComments = () => {
    getComments(vid).then((result) => {
      console.log(result);
      setComments(result.data)
    }).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    if (reducer.state.refresh === true) {
      console.log('Refreshing', reducer.state)
      refreshCommentLikesDislikes();
      refreshComments();
      reducer.dispatch({
        type: 'REFRESHED'
      });
    }
  }, [reducer.state]);

  return (
    <Wrapper>
      {comments.map((comment) => (
        <div key={comment.cid} className="comment">
          <div className="comment-info">
            <div
              style={{
                display: "flex",
                width: "fit-content",
                paddingBottom: "10px",
                backgroundColor: "rgb(20, 20, 20)",
                borderRadius: 20,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
              }}
            >
              <span>{comment.username}</span>
            </div>
            <div style={{ paddingLeft: 5, paddingTop: 10, paddingBottom: 5 }}>
              <span>{comment.comment}</span>
            </div>

            <div style={{ display: "flex" }}>
              {checkCommentLiked(comment.cid) ?
                <i
                  style={{ padding: "5px", color: "green" }}
                  className={`Icon fa fa-thumbs-up`}
                  onClick={() => { handleLike(comment.cid, false) }}
                />
                : !checkCommentDisliked(comment.cid) ?
                  <i
                    style={{ padding: "5px", color: "white" }}
                    className={`Icon fa fa-thumbs-up`}
                    onClick={() => { handleLike(comment.cid, true) }}
                  />
                  :
                  <i
                    style={{ padding: "5px", color: "grey" }}
                    className={`Icon fa fa-thumbs-up`}
                  />
              }
              <span style={{ alignSelf: "center" }}> {comment.likes}</span>
              {checkCommentDisliked(comment.cid) ?
                <i
                  style={{ padding: "5px", color: "red" }}
                  className={`Icon fa fa-thumbs-down`}
                  onClick={() => { handleDislike(comment.cid, false) }}
                />
                : !checkCommentLiked(comment.cid) ?
                  <i
                    style={{ padding: "5px", color: "white" }}
                    className={`Icon fa fa-thumbs-down`}
                    onClick={() => { handleDislike(comment.cid, true) }}
                  />
                  :
                  <i
                    style={{ padding: "5px", color: "grey" }}
                    className={`Icon fa fa-thumbs-down`}
                    onClick={() => { handleDislike(comment.cid, true) }}
                  />
              }
              <span style={{ alignSelf: "center" }}> {comment.dislikes}</span>
            </div>
          </div>
        </div>
      ))}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin: 1rem 0;
  h3 {
    margin-bottom: 0.8rem;
  }

  .comment {
    display: flex;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: white;
    padding-left: 10px;
  }
`;
export default Comments;
