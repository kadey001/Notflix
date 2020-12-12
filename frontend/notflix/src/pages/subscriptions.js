import React, { useState, useEffect } from "react";
import BrowseHeader from "../components/browseHeader/browseHeader";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Global, css } from "@emotion/react";
import PlayerHeader from "../components/playerHeader/playerHeader";

export default function Subscriptions() {
  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <HeaderJumbotron />
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
  .check-box {
    margin-right: 5px;
    margin-left: 8px;
    display: block;
    float: left;
    white-space: nowrap;
    vertical-align: middle;
    margin-top: 1px;
  }
  .label {
    display: inline-block;
    width: 6em;
    margin-right: 0.5em;
    padding-top: 0.3em;
    color: #a9a9a9;
  }
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    display: block;
    width: 100%;
    background: #333;
    border-radius: 4px;
    border: 0;
    color: white;
    height: 50px;
    line-height: 50px;
    margin-bottom: 20px;
    padding-left: 6px;
  }
  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    padding-bottom: 20px;
  }

  .btn {
    border: 2px solid #e50914;
    color: rgb(255, 255, 255);
    background-color: #e50914;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
    width: 100%;
  }

  .upload-btn-wrapper input[type="file"] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
`;
