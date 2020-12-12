/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import Icon from "../../components/Icon/Icon";

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
      <Icon type="times" onClick={setActive} />
    </div>
  );

export default DetailPane;
