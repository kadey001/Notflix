/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import { Button } from "semantic-ui-react";
/**
 * @function Overview
 */
const Overview = (props) => {
  console.log(props);
  return (
    <div css={OverviewCSS}>
      <p>title: {props.metadata.title}</p>
      <p>description: {props.metadata.description}</p>
      <p>length: {props.metadata.length}</p>
      <p>rating: {props.metadata.rating}</p>
      <Button variant="contained">Play</Button>
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
