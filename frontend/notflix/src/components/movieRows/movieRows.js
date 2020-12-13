/** @jsx jsx */
import React, { useState, useCallback, useEffect } from "react";
//import { css } from "@emotion/core";
import { css, jsx } from "@emotion/react";
import styled from "@emotion/styled";
import Icon from "../../components/Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory, useParams, Link } from "react-router-dom";
import axios from "axios";
import CardDetails from "../../components/cardDetails/cardDetails";
import Overview from "../../components/cardDetails/overview";

import one from "../../img/one.jpg";
import two from "../../img/two.jpg";
import three from "../../img/three.jpg";
import four from "../../img/four.jpg";
import five from "../../img/five.jpg";
import six from "../../img/six.jpg";

const content = [one, two, three, four, five, six];

const MovieRows = ({
  category,
  setActive,
  title,
  description,
  length,
  rating,
}) => {
  const [hovered, setHovered] = useState(false);
  const history = useHistory();
  const [movies, setMovies] = useState([
    {
      vid: "5186eb59-bed7-4de0-ba7c-5f6ffbc5ae95",
      thumbnailURL: one,
      title: "Rats 1",
      description: "A movie about even more Rats.",
      length: 10,
      released: Date,
      comedy: true,
      horror: true,
      action: true,
      drama: false,
      fantasy: true,
    },
    {
      vid: "5186eb59-bed7-4de0-ba7c-5f6ffbc5ae96",
      thumbnailURL: two,
      title: "Rats 2",
      description: "A movie about even more Rats.",
      length: 20,
      released: Date,
      comedy: false,
      horror: true,
      action: true,
      drama: false,
      fantasy: true,
    },
  ]);

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
              data-img={image.thumbnailURL}
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
            >
              {image.thumbnailURL === hovered && (
                <div className="content">
                  <Icon
                    type="play"
                    onClick={({ target }) =>
                      history.push(`/watch/${image.vid}`)
                    }
                  />
                  <Icon type="info-circle" onClick={getPos} />
                  <Icon type="thumbs-up" />
                </div>
              )}
              <img src={image.thumbnailURL} />
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
