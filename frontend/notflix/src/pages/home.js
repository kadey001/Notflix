import React, { useContext } from "react";
import { JumbotronContainer } from "../containers/jumbotron";
import { HeaderContainer } from "../containers/header";

import { AuthContext } from '../context/auth';
import { Redirect } from "react-router-dom";

export default function Home() {
  const { state } = useContext(AuthContext);
  console.log(state);
  return (
    <div>
      {
        !state.isAuthenticated ?
          <>
            <HeaderContainer></HeaderContainer>
            <JumbotronContainer />
          </>
          :
          <Redirect to='/browse' />
      }
    </div>
  );
}
