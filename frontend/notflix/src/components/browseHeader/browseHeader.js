/** @jsx jsx */
import React, { useState, useEffect, forwardRef, useContext } from "react";
import { css, jsx } from "@emotion/react";
import Icon from "../../components/Icon/Icon";
import { Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { searchVideos } from "../api/videos";

const leftLinks = ["Upload", "Subscriptions"];

const BrowseHeader = forwardRef((props, ref) => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const { dispatch } = useContext(AuthContext);

  const handleSignOut = () => {
    dispatch({
      type: "LOGOUT",
    });
    history.push("/");
  };

  useEffect(() => {
    const handleScroll = () =>
      window.pageYOffset > 75 ? setScrolled(true) : setScrolled(false);

    const onScroll = window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearching(true);
    // TODO parse and do search on each keyword, concat the results
    searchVideos(searchText).then((result) => {
      console.log(result.data);
      history.push('/search', result.data);
    }).catch((err) => {
      console.error(err);
      setSearching(false);
    });
  }

  const toggleSearch = (e) => {
    e.preventDefault();
    setShowSearch(!showSearch);
  }

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
          <a href="/browse">
            <img height="32" src={"images/logo/logo.png"} alt="Notflix" />
          </a>
        </li>

        {/* {leftLinks.map((link) => (
          <li key={link}>
            <a href="/">{link}</a>
          </li>
        ))} */}

        <li>
          <a href="/upload">
            <p> Upload </p>
          </a>
        </li>

        <li>
          <a href="/subscriptions">
            <p> Subscriptions </p>
          </a>
        </li>
      </ul>

      <ul className="right">
        <li>
          <form onSubmit={handleSearch}>
            <Icon type="search" onClick={toggleSearch} />
            {showSearch ?
              <input type='text'
                value={searchText}
                onChange={({ target }) => setSearchText(target.value)}
              />
              :
              <></>
            }
          </form>
        </li>
        <li>
          <Button
            style={{ border: "none", background: "transparent" }}
            onClick={handleSignOut}
          >
            {" "}
            Sign Out{" "}
          </Button>
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
