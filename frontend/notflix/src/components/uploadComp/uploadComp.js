import React, { Fragment, Component, useState } from "react";
import "./upload.css";
import "filepond/dist/filepond.min.css";
import { FilePond, File } from "react-filepond";

const Upload = () => {
  const [files, setFiles] = useState([]);
  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}
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
  );
};

export default Upload;
