import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Global, css } from "@emotion/react";
import PlayerHeader from "../components/playerHeader/playerHeader";
import { Form } from "../components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

async function addVideo(uploadData, videoFile, thumbnailFile) {
  console.log(videoFile, thumbnailFile);
  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("thumbnail", thumbnailFile);
  formData.append("title", uploadData.title);
  formData.append("description", uploadData.description);
  formData.append("length", uploadData.length);
  formData.append("released", uploadData.released.toUTCString());
  formData.append("comedy", uploadData.comedy);
  formData.append("horror", uploadData.horror);
  formData.append("action", uploadData.action);
  formData.append("drama", uploadData.drama);
  formData.append("fantasy", uploadData.fantasy);
  formData.append("documentary", uploadData.documentary);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  return await axios.post(
    "http://13.77.174.221:3001/video/add-movie",
    formData,
    config
  );
}

export default function Upload() {
  const [startDate, setStartDate] = useState("");
  const [videoFile, setvideoFile] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState([]);
  const [videoFileName, setVideoFileName] = useState("Choose a video");
  const [thumbnailFileName, setThumbnailFileName] = useState(
    "Choose a thumbnail"
  );
  const [loading, setLoading] = useState(false);

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
    documentary: false,
  });

  console.log(startDate);
  console.log(uploadData);
  console.log(videoFile);
  console.log(thumbnailFile);

  const [error, setError] = useState("");

  const isInvalid =
    uploadData.title === "" ||
    uploadData.description === "" ||
    uploadData.length === "" ||
    uploadData.released === null;

  const handleUpload = (event) => {
    event.preventDefault();
    setLoading(true);
    // Disable submit button so only one req is sent.
    addVideo(uploadData, videoFile, thumbnailFile)
      .then((result) => {
        console.log(result);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) setError(err.response.statusText);
        else setError(err.message);
        setLoading(false);
      });
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

  const onChangeDocumentary = () => {
    setUploadData((initialState) => ({
      ...uploadData,
      documentary: !initialState.documentary,
    }));
  };

  const onVideoChange = (e) => {
    setvideoFile(e.target.files[0]);
    setVideoFileName(e.target.files[0].name);
  };

  const onThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
    setThumbnailFileName(e.target.files[0].name);
  };
  return (
    <>
      <Global styles={GlobalCSS} />
      <PlayerHeader />
      <HeaderJumbotron />

      <Form>
        {error && <Form.Error>{error}</Form.Error>}

        <Form.Base onSubmit={handleUpload} method="POST">
          <div className="upload-btn-wrapper">
            <button className="btn">{videoFileName}</button>
            <input
              type="file"
              accept="video/mp4"
              name="myfile"
              onChange={onVideoChange}
            />
          </div>
          <div className="upload-btn-wrapper">
            <button className="btn">{thumbnailFileName}</button>
            <input
              type="file"
              accept="image/jpeg"
              name="myfile"
              onChange={onThumbnailChange}
            />
          </div>
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
            placeholder="Length (minutes)"
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
              height: 75,
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
            <label className="label">
              <input
                className="check-box"
                type="checkbox"
                onChange={onChangeDocumentary}
              />
              Documentary
            </label>
          </div>

          <Form.Submit disabled={isInvalid || loading} type="submit">
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
    width: 8em;
    margin-right: 1.5em;
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
