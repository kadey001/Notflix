/** @jsx jsx */
import React, { useState, useCallback, useEffect } from "react";
//import { css } from "@emotion/core";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Icon from "../../components/Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";

import one from "../../img/one.jpg";
import two from "../../img/two.jpg";
import three from "../../img/three.jpg";
import four from "../../img/four.jpg";
import five from "../../img/five.jpg";
import six from "../../img/six.jpg";

const content = [one, two, three, four, five, six];

const MovieRows = ({ category, setActive }) => {
  const [hovered, setHovered] = useState(false);
  const history = useHistory();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get("");
      console.table(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, []);

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
          {movies.map((image) => (
            <ContentCard
              key={image.vid}
              data-img={image.img}
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
            >
              {image === hovered && (
                <div className="content">
                  <Icon
                    type="play"
                    onClick={history.push(`/watch/${image.vid}`)}
                  />
                  <Icon type="info-circle" onClick={getPos} />
                  <Icon type="thumbs-up" />
                </div>
              )}
              <img src={image.img} />
            </ContentCard>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentCard = styled.div`
  position: relative;
  flex: calc(18vw - 4px);
  flex-shrink: 0;
  height: 9.5vw;
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
