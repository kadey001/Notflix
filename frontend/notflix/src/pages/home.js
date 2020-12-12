import React from "react";
import { JumbotronContainer } from "../containers/jumbotron";
import { HeaderContainer } from "../containers/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Home() {
  return (
    <>
      <HeaderContainer></HeaderContainer>
      <JumbotronContainer />
    </>
  );
}
