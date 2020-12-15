import React, { useState, useEffect, useContext, useCallback } from "react";
import { Global, css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Icon from "../components/Icon/Icon";
import Footer from "../components/footer/footer";
import CardDetails from "../components/cardDetails/searchCardDetails";
import BrowseHeader from "../components/browseHeader/browseHeader";
import HeaderJumbotron from "../components/headerJumbotron/headerJumbotron";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { VideoContext } from "../context/video";
import { Redirect, useLocation } from "react-router-dom";
import { getList, getLiked } from "../components/api/videos";
import { Grid, Segment } from "semantic-ui-react";

const initialRow = {
  results: "",
  pos: { top: 0, bottom: 0 },
};
export default function SearchResults() {
  const location = useLocation();
  const history = useHistory();
  const results = location.state;
  console.log(results);
  const [activeRow, setActiveRow] = useState(initialRow);
  const [hovered, setHovered] = useState(false);
  const [metadata, setMetadata] = useState({
    title: "Title",
    description: "Desc",
    length: "20 mins",
    rating: 50,
  });
  const auth = useContext(AuthContext);

  // const {
  //   results,
  //   pos: { top, bottom },
  // } = activeRow;

  const setActive = (activeRow) => {
    activeRow.results ? setActiveRow(activeRow) : setActiveRow(initialRow);
  };
  console.log(activeRow);
  // useEffect(() => {
  //   if (!results) return;
  //   window.scrollTo({
  //     top: top + window.scrollY,
  //     left: 0,
  //     behavior: "smooth",
  //   });
  // }, [results]);

  const openCard = (metadata) => {
    console.log("Metadata: ", metadata);

    setMetadata({
      vid: metadata.vid,
      title: metadata.title,
      description: metadata.description,
      length: metadata.filmlength,
      likes: metadata.likes,
      dislikes: metadata.dislikes,
      views: metadata.views,
      genres: metadata.genres,
      img: metadata.img,
    });
  };

  const handleHover = useCallback((e) => {
    e.type === "mouseenter"
      ? setHovered(e.target.getAttribute("data-img"))
      : setHovered(false);
  }, []);

  const getPos = useCallback((e) => {
    const pos = e.target.parentElement.getBoundingClientRect();
    setActive({ pos });
  }, []);

  return (
    <div>
      {auth.state.isAuthenticated ? (
        <>
          <Global styles={GlobalCSS} />
          <BrowseHeader />

          <HeaderJumbotron />
          <div
            css={css`
              h2 {
                margin: 20px 0 10px;
                color: white;
              }
              .block-wrapper {
                display: flex;
                width: 100%;
                position: relative;
              }
            `}
          >
            <h2>Search Results</h2>
          </div>
          <div
            css={css`
              display: flex;
              flex-direction: column;
              flex: 1;
            `}
          >
            <Grid style={{ display: "flex" }} doubling columns={4}>
              {results.slice(0).map((video) => (
                <Grid.Column>
                  <ContentCard
                    key={video.vid}
                    data-img={video.img}
                    onMouseEnter={handleHover}
                    onMouseLeave={handleHover}
                  >
                    {video.img === hovered && (
                      <div className="content">
                        <Icon
                          type="play"
                          onClick={() => history.push(`/watch/${video.vid}`)}
                        />
                        <Icon
                          type="info-circle"
                          onClick={(e) => {
                            getPos(e);
                            openCard(video);
                          }}
                        />
                      </div>
                    )}
                    <img src={video.img} />
                  </ContentCard>
                </Grid.Column>
              ))}
            </Grid>
          </div>
          <CardDetails
            pos={activeRow}
            setActive={setActive}
            metadata={metadata}
          />
          <Footer />
        </>
      ) : (
        <Redirect to="/" />
      )}
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

const ContentCard = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 9.5vw;
  width: 18vw;
  margin-right: 4px;
  margin-left: 20px;

  .content {
    position: absolute;
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    padding-left: 20px;
    justify-content: space-evenly;
    transition: background-color ease 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
    }
    .Icon {
      font-size: 32px;
    }
    .Icon:first-of-type {
      color: red;
      margin-right: 25px;
    }
    .Icon:last-of-type {
      color: white;
    }
  }

  img {
    height: 100%;
    width: 100%;
    pointer-events: none;
  }
`;
