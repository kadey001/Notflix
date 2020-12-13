import React, { useContext, createContext } from "react";
import { render } from "react-dom";
import App from "./app";
import { GlobalStyles } from "./globalStyles";
import "normalize.css";

// const auth = createContext();


render(
  <>
    <GlobalStyles />
    <App />
  </>,
  document.getElementById("root")
);