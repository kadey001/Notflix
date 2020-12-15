import React, { useState } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";

const Comments = () => {
  const [comments, setComments] = useState([
    {
      cid: 1,
      username: "Alex",
      comment: "hey there",
      likes: 10,
      dislikes: 30,
    },
    {
      cid: 2,
      username: "John",
      comment: "hello world",
      likes: 20,
      dislikes: 24,
    },
  ]);

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
              <i
                style={{ padding: "5px" }}
                className={`Icon fa fa-thumbs-up`}
              />
              <span style={{ alignSelf: "center" }}> {comment.likes}</span>
              <i
                style={{ padding: "5px" }}
                className={`Icon fa fa-thumbs-down`}
              />
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
