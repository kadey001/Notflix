import React, { useState, useEffect } from "react";
import Rows from "../components/movieRows/movieRows";
import Footer from "../components/footer/footer";
import CardDetails from "../components/cardDetails/cardDetails";
import BrowseHeader from "../components/browseHeader/browseHeader";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Global, css } from "@emotion/react";
import PlayerHeader from "../components/playerHeader/playerHeader";
import UploadComp from "../components/uploadComp/uploadComp";
import { Form } from "../components";
import Select from "react-select";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [length, setLength] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedOption, setSelectedOption] = useState("none");

  console.log(genre);
  console.log(selectedOption);

  const [error, setError] = useState("");

  const isInvalid =
    title === "" ||
    description === "" ||
    length === "" ||
    releaseDate === "" ||
    genre === "";
  const handleUpload = (event) => {
    event.preventDefault();
    //Handle sign in request here
  };
  const handleTypeSelect = (e) => {
    setSelectedOption(e.lablel);
  };
  const options = [
    {
      label: "Comedy",
      value: "comedy",
    },
    {
      label: "Horror",
      value: "horror",
    },
    {
      label: "Action",
      value: "action",
    },
    {
      label: "Drama",
      value: "drama",
    },
    {
      label: "Fantasy",
      value: "fantasy",
    },
  ];

  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <HeaderJumbotron />
      <UploadComp />
      <Form>
        {error && <Form.Error>{error}</Form.Error>}

        <Form.Base onSubmit={handleUpload} method="POST">
          <Form.Input
            placeholder="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <Form.Input
            placeholder="Description"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <Form.Input
            placeholder="Length"
            value={length}
            onChange={({ target }) => setLength(target.value)}
          />
          <Form.Input
            placeholder="Release Date"
            value={releaseDate}
            onChange={({ target }) => setReleaseDate(target.value)}
          />

          <Select
            styles={colourStyles}
            selection
            options={options}
            onChange={(e) => {
              setGenre({ genre: e.value });
              setSelectedOption({ selectedOption: e.label });
            }}
            value={() => this.value}
            placeholder="Genre"
            autosize={true}
          />
          <Form.Submit disabled={isInvalid} type="submit">
            Upload
          </Form.Submit>
        </Form.Base>
      </Form>
    </>
  );
}
const colourStyles = {
  placeholder: (defaultStyles) => ({
    ...defaultStyles,
    color: "#A9A9A9",
    padding: "10px",
  }),
  selection: (styles) => ({
    ...styles,
    color: "#A9A9A9",
    padding: "0px",
  }),
  control: (styles) => ({
    ...styles,
    backgroundColor: "#333",
    borderColor: "#333",
    height: "50px",
  }),
  menu: (base) => ({
    ...base,
    // override border radius to match the box

    // kill the gap
    marginTop: 1,
    backgroundColor: "#333",
    color: "#A9A9A9",
    padding: "10px",
  }),
  container: (styles) => ({ ...styles }),
  menuList: (base) => ({
    ...base,
    // kill the white space on first and last option
    padding: 0,
  }),
};
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
