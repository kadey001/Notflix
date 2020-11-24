import React, { useState, useEffect } from "react";
import Rows from "../components/movieRows/movieRows";
import Footer from "../components/footer/footer";
import CardDetails from "../components/cardDetails/cardDetails";
import BrowseHeader from "../components/browseHeader/browseHeader";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Global, css } from "@emotion/react";
import PlayerHeader from "../components/playerHeader/playerHeader";
import UploadComp from "../components/uploadComp/uploadComp";

export default function Upload() {
  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <HeaderJumbotron />
      <UploadComp />
    </>
  );
}
const UploadCSS = css`
  .filepond--root .filepond--drop-label {
    height: 200px;
  }
  .filepond--item {
    width: calc(50% - 0.5em);
  }
  @media (min-width: 30em) {
    .filepond--item {
      width: calc(50% - 0.5em);
    }
  }

  @media (min-width: 50em) {
    .filepond--item {
      width: calc(33.33% - 0.5em);
    }
  }
`;
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
