/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/react";
import Icon from "../../components/Icon/Icon";
import Overview from "./overview";

const DetailPane = ({ activeRow, pos, setActive, metadata, top }) =>
  pos && (
    <div
      css={[
        DetailsCSS,
        css`
          top: ${top}px;
        `,
      ]}
    >
      <div
        css={css`
          padding: 2vw 4vw 0;
        `}
      >
        <Overview metadata={metadata} />
        <i css={timesIcon} className={`Icon fa fa-times`} onClick={setActive} />
      </div>
    </div>
  );
const DetailsCSS = css`
  height: 475px;
  background: black;
  width: 100%;
  position: absolute;
  border: 2px solid white;

  z-index: 99;
  color: white;
`;
const timesIcon = css`
  font-size: 32px;
  color: white;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;
export default DetailPane;
