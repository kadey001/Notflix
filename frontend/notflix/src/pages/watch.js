import React, { useReducer } from "react";
import Footer from "../components/footer/footer";
import PlayerHeader from "../components/playerHeader/playerHeader";
import { Global, css } from "@emotion/react";
import Player from "../components/player/player";
import AddComment from "../containers/comments/addComment/addComment";
import Comments from "../containers/comments/comment/comment";
import { useParams } from "react-router-dom";

const initialWatchState = {
  refresh: true,
}

const watchReducer = (state, action) => {
  switch (action.type) {
    case "REFRESH":
      return {
        ...state,
        refresh: true
      };
    case "REFRESHED":
      return {
        ...state,
        refresh: false
      };
    default:
      return state;
  }
};

export default function VideoPlayer() {
  const params = useParams();
  const [watchState, watchDispatch] = useReducer(watchReducer, initialWatchState);

  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <Player />
      <AddComment vid={params.vid} reducer={{ state: watchState, dispatch: watchDispatch }} />
      <Comments vid={params.vid} reducer={{ state: watchState, dispatch: watchDispatch }} />
    </>
  );
}
const GlobalCSS = css`
  * {
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
    outline: none;
  }
  html,
  body,
  .app {
    margin: 0;
    min-height: 100%;
    width: 100%;
  }
  body {
    background: #151515;
  }
  a {
    text-decoration: none;
    color: white;
  }
  p {
    font-size: 20px;
  }
  ul {
    margin: 0;
    list-style: none;
    padding: 0;
  }
  button {
    background-color: rgba(51, 51, 51, 0.8);
    border: 1px solid white;
    padding: 0.75em 2.3em;
    border-radius: 0.2vw;
    box-shadow: none;
    font-size: 1.1vw;
    color: white;
    margin-right: 15px;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
  .Icon {
    font-size: 18.5px;
    cursor: pointer;
    color: white;
  }
`;
const divStyle = css`
  padding-top: "100px";
`;
