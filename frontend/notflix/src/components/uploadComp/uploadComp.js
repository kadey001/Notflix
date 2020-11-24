import React, { Component, useState } from "react";
import "./upload.css";
import { css, jsx } from "@emotion/react";
import "filepond/dist/filepond.min.css";
import { FilePond, File } from "react-filepond";

const Upload = () => {
  const [files, setFiles] = useState([]);
  return (
    <div
      style={{ display: "flex", justifyContent: "center", paddingTop: "100px" }}
    >
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        dropOnPage
        server="/api" // your file upload api
        name="files"
        dropOnPage
        dropValidation
      />
    </div>
  );
};

export default Upload;
