/** @jsx jsx */
import React, { useState, useCallback, useEffect, useContext } from "react";
//import { css } from "@emotion/core";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Icon from "../../components/Icon/Icon";
import { useHistory } from "react-router-dom";
import { getGenre, getTop } from "../api/videos";
import axios from "axios";
import { VideoContext } from "../../context/video";

const setGenres = (category) => {
  const genres = {
    comedy: false,
    horror: false,
    action: false,
    drama: false,
    fantasy: false,
    documentary: false,
  };
  switch (category) {
    case "Comedy":
      genres.comedy = true;
      break;
    case "Horror":
      genres.horror = true;
      break;
    case "Action":
      genres.action = true;
      break;
    case "Drama":
      genres.drama = true;
      break;
    case "Fantasy":
      genres.fantasy = true;
      break;
    case "Documentary":
      genres.documentary = true;
      break;
  }
  return genres;
};

const MovieRows = ({ category, setActive, setMetadata }) => {
  const history = useHistory();
  const { state } = useContext(VideoContext);
  const [hovered, setHovered] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    switch (category) {
      case "Top":
        getTop()
          .then((result) => {
            console.log("Top Results: ", result);
            setMovies(result.data);
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      case "List":
        const listedVideos = state.listedVideos;
        if (!listedVideos) return;
        setMovies(listedVideos);
        break;
      default:
        const genres = setGenres(category);
        getGenre(genres)
          .then((result) => {
            console.log(result.data);
            setMovies(result.data);
          })
          .catch((err) => {
            if (axios.isCancel(err)) {
            } else {
              throw err;
            }
          });
    }
  }, []);

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
    setActive({ category, pos });
  }, []);

  return (
    <div
      className="movieRows"
      css={css`
        padding-left: 60px;
        overflow-x: hidden;
      `}
    >
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
        <h2>{category}</h2>

        <div
          className="block-wrapper"
          css={css`
            overflow-x: scroll;
            overflow-y: hidden;
            -webkit-scrollbar {
              display: none;
            }
          `}
        >
          {movies.map((video) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentCard = styled.div`
  position: relative;
  flex-shrink: 0;
  height: 9.5vw;
  width: 18vw;
  margin-right: 4px;

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

export default MovieRows;
