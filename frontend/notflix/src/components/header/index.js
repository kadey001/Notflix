import React from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import {
  Background,
  ButtonLink,
  Container,
  Logo,
  ButtonLink2,
  Link,
  Group,
} from "./styles/header";

export default function Header({ bg = true, children, ...restProps }) {
  return bg ? <Background {...restProps}>{children}</Background> : children;
}

Header.Frame = function HeaderFrame({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>;
};

Header.Group = function HeaderGroup({ children, ...restProps }) {
  return <Container {...restProps}>{children}</Container>;
};

Header.ButtonLink = function HeaderButtonLink({ children, ...restProps }) {
  return <ButtonLink {...restProps}>{children}</ButtonLink>;
};
Header.ButtonLink2 = function HeaderButtonLink2({ children, ...restProps }) {
  return <ButtonLink2 {...restProps}>{children}</ButtonLink2>;
};
Header.Link = function HeaderLink({ children, ...restProps }) {
  return <Link {...restProps}>{children}</Link>;
};

Header.Logo = function HeaderLogo({ to, ...restProps }) {
  return (
    <ReactRouterLink to={to}>
      <Logo {...restProps} />
    </ReactRouterLink>
  );
};
