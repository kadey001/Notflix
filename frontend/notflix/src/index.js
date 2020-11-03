import React from "react";
import { render } from "react-dom";
import App from "./app";
import { GlobalStyles } from "./globalStyles";
import "normalize.css";

render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById("root")
);
