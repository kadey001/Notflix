import React, { useState, useEffect, useContext } from "react";
import Rows from "../components/movieRows/movieRows";
import Footer from "../components/footer/footer";
import CardDetails from "../components/cardDetails/cardDetails";
import BrowseHeader from "../components/browseHeader/browseHeader";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { Global, css } from "@emotion/react";

import { AuthContext } from '../context/auth';
import { Redirect } from "react-router-dom";

const categories = ["Top", "liked", "Comedy", "Horror", "Action", "Drama", "Fantasy", "Documentary"];
const initialRow = {
  category: "",
  pos: { top: 0, bottom: 0 },
};
export default function Browse() {
  const [activeRow, setActiveRow] = useState(initialRow);
  const [metadata, setMetadata] = useState({
    title: 'Title',
    description: 'Desc',
    length: '20 mins',
    rating: 50
  });
  const { state } = React.useContext(AuthContext);

  const {
    category,
    pos: { top, bottom },
  } = activeRow;

  const setActive = (activeRow) => {
    activeRow.category ? setActiveRow(activeRow) : setActiveRow(initialRow);
  };
  useEffect(() => {
    if (!category) return;
    window.scrollTo({
      top: top + window.scrollY,
      left: 0,
      behavior: "smooth",
    });
  }, [category]);

  return (
    <div>{state.isAuthenticated ?
      <>
        <Global styles={GlobalCSS} />
        <BrowseHeader />
        <HeaderJumbotron />
        {categories.slice(0).map((category) => (
          <Rows key={category} category={category} setActive={setActive} setMetadata={setMetadata} />
        ))}
        <CardDetails category={category} pos={bottom} setActive={setActive} metadata={metadata} />
        <Footer />
      </>
      :
      <Redirect to='/' />
    }
    </div>
  );
}
const GlobalCSS = css`
  * {
    box-sizing: border-box;
    font-family: "Roboto", sans-serif;
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
