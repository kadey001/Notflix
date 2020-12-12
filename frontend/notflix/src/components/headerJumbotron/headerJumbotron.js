/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";

const HeaderJumbotron = ({ children }) => (
  <div css={JumbotronCSS}>
    <div className="synopsis"></div>
    {children}
  </div>
);

const JumbotronCSS = css`
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 8vh;
  top: 0;
  .synopsis {
    padding-top: 200px;
    padding-left: 60px;
    max-width: 500px;
    color: white;
    padding-left: 60px;
    img {
      width: 100%;
    }
    .Icon {
      margin-right: 10.5px;
      font-size: 18px;
    }
  }
  .ContentRow {
    position: absolute;
    bottom: 20px;
  }
`;
export default HeaderJumbotron;
