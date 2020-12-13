/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import Icon from "../../components/Icon/Icon";
import Overview from "./overview";

const DetailPane = ({ category, pos, setActive }) =>
  category && (
    <div
      css={css`
        height: 475px;
        background: black;
        width: 100%;
        position: absolute;
        border: 2px solid white;
        top: ${pos + window.scrollY}px;
        z-index: 99;
        .Icon {
          font-size: 32px;
          color: white;
          position: absolute;
          right: 20px;
          top: 20px;
          cursor: pointer;
        }
      `}
    >
      <div
        css={css`
          padding: 2vw 4vw 0;
        `}
      >
        <Overview title={""} description={""} length={""} rating={""} />
        <Icon type="times" onClick={setActive} />
      </div>
    </div>
  );

export default DetailPane;
