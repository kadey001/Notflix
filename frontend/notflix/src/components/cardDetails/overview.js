/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import { Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
/**
 * @function Overview
 */
const Overview = (props) => {
  const history = useHistory();
  console.log('Props: ', props);
  return (
    <div css={OverviewCSS}>
      <p>title: {props.metadata.title}</p>
      <p>description: {props.metadata.description}</p>
      <p>length: {props.metadata.length} min</p>
      <p>likes: {props.metadata.likes}</p>
      <p>dislikes: {props.metadata.dislikes}</p>
      <p>views: {props.metadata.views}</p>
      <Button variant="contained" onClick={() => history.replace(`/watch/${props.metadata.vid}`)}>Play</Button>
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
