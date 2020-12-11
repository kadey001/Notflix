import React, { Fragment, useState, useEffect } from "react";
import Rows from "../components/movieRows/movieRows";
import Footer from "../components/footer/footer";
import CardDetails from "../components/cardDetails/cardDetails";
import BrowseHeader from "../components/browseHeader/browseHeader";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Global, css } from "@emotion/react";
import PlayerHeader from "../components/playerHeader/playerHeader";
import { Form } from "../components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Upload() {
  const [genre, setGenre] = useState("");
  const [selectedOption, setSelectedOption] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [files, setFiles] = useState([]);

  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    length: "",
    released: null,
    comedy: false,
    horror: false,
    action: false,
    drama: false,
    fantasy: false,
  });

  console.log(genre);
  console.log(startDate);
  console.log(uploadData);

  const [error, setError] = useState("");

  const isInvalid =
    uploadData.title === "" ||
    uploadData.description === "" ||
    uploadData.length === "" ||
    uploadData.released === "";

  const handleUpload = (event) => {
    event.preventDefault();
    //Handle sign in request here
  };

  const handleChange = (selectedOption) => {
    setSelectedOption({ selectedOption });
    if (selectedOption == "comedy") {
      setUploadData({ comedy: true });
      console.log(uploadData.comedy);
    }
  };

  const onChangeComedy = () => {
    setUploadData((initialState) => ({
      ...uploadData,
      comedy: !initialState.comedy,
    }));
  };

  const onChangeHorror = () => {
    setUploadData((initialState) => ({
      ...uploadData,
      horror: !initialState.horror,
    }));
  };

  const onChangeAction = () => {
    setUploadData((initialState) => ({
      ...uploadData,
      action: !initialState.action,
    }));
  };

  const onChangeDrama = () => {
    setUploadData((initialState) => ({
      ...uploadData,
      drama: !initialState.drama,
    }));
  };

  const onChangeFantasy = () => {
    setUploadData((initialState) => ({
      ...uploadData,
      fantasy: !initialState.fantasy,
    }));
  };
  const handleDateChange = (date) => {
    setStartDate(date);
  };
  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <HeaderJumbotron />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "100px",
        }}
      >
        <Fragment>
          <form>
            <div class="upload-btn-wrapper">
              <button class="btn">Choose a file</button>
              <input type="file" name="myfile" />
            </div>
          </form>
        </Fragment>
      </div>
      <Form>
        {error && <Form.Error>{error}</Form.Error>}

        <Form.Base onSubmit={handleUpload} method="POST">
          <Form.Input
            placeholder="Title"
            value={uploadData.title}
            onChange={({ target }) =>
              setUploadData({ ...uploadData, title: target.value })
            }
          />
          <Form.Input
            placeholder="Description"
            value={uploadData.description}
            onChange={({ target }) =>
              setUploadData({ ...uploadData, description: target.value })
            }
          />
          <Form.Input
            type="number"
            placeholder="Length"
            value={uploadData.length}
            onChange={({ target }) =>
              setUploadData({ ...uploadData, length: target.value })
            }
          />

          <DatePicker
            placeholderText="Release Date"
            selected={startDate}
            onChange={(date) => {
              setUploadData({ ...uploadData, released: date });
              setStartDate(date);
            }}
            dropdownMode="select"
            showMonthDropdown
            showYearDropdown
            adjustDateOnChange
          />

          <div
            style={{
              display: "inline-block",
              width: 314,
              backgroundColor: "#333",
              borderRadius: 4,
              height: 50,
              justifyContent: "center",
            }}
          >
            <label className="label">
              <input
                className="check-box"
                type="checkbox"
                onChange={onChangeComedy}
              />
              Comedy
            </label>
            <label className="label">
              <input
                className="check-box"
                type="checkbox"
                onChange={onChangeHorror}
              />
              Horror
            </label>
            <label className="label">
              <input
                className="check-box"
                type="checkbox"
                onChange={onChangeAction}
              />
              Action
            </label>
            <label className="label">
              <input
                className="check-box"
                type="checkbox"
                onChange={onChangeDrama}
              />
              Drama
            </label>
            <label className="label">
              <input
                className="check-box"
                type="checkbox"
                onChange={onChangeFantasy}
              />
              Fantasy
            </label>
          </div>

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
