/** @jsx jsx */
import React, { useState, useEffect, forwardRef } from "react";
import { css, jsx } from "@emotion/react";
import Icon from "../../components/Icon/Icon";
import { useHistory, useParams } from "react-router-dom";

const leftLinks = ["Home", "Upload", "My Library"];

const BrowseHeader = forwardRef((props, ref) => {
  const [scrolled, setScrolled] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const handleScroll = () =>
      window.pageYOffset > 75 ? setScrolled(true) : setScrolled(false);

    const onScroll = window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      ref={ref}
      css={[
        NavbarCSS,

        css`
          background-color: rgb(20, 20, 20);
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.7) 10%,
            rgba(0, 0, 0, 0)
          );
        `,
      ]}
    >
      <ul>
        <li>
          <ul>
            <li>
              <Icon
                type="arrow-left"
                onClick={() => {
                  history.goBack();
                }}
              />
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
});

const NavbarCSS = css`
  position: fixed;
  height: 68px;
  z-index: 99;
  width: 100%;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ul {
    display: flex;
    align-items: center;
  }
  li {
    margin-right: 20px;
    list-style-type: none;
  }
  a {
    font-size: 15px;
    letter-spacing: 0.5px;
    color: #e5e5e5;
  }
  a.active {
    color: white;
    font-weight: 500;
  }
  ul.right {
    .Icon {
      color: white;
      cursor: pointer;
      font-size: 22px;
      padding-right: 10px;
    }
  }
`;

export default BrowseHeader;
