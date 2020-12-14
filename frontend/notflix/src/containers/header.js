import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Header } from "../components";
import * as ROUTES from "../constants/routes";

export function HeaderContainer({ children }) {
  const location = useLocation();
  return (
    <Header>
      <Header.Frame>
        <Header.Logo
          to={ROUTES.HOME}
          src={"images/logo/logo.png"}
          alt="Notflix"
        />
        {location.pathname === '/signin' ?
          <Header.ButtonLink to={ROUTES.SIGN_UP}>Signup</Header.ButtonLink>
          :
          <Header.ButtonLink to={ROUTES.SIGN_IN}>Sign In</Header.ButtonLink>
        }
      </Header.Frame>
      {children}
    </Header>
  );
}
