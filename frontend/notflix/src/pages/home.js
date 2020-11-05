import React from "react";
import { JumbotronContainer } from "../containers/jumbotron";
import { HeaderContainer } from "../containers/header";

export default function Home() {
  return (
    <>
      <HeaderContainer></HeaderContainer>
      <JumbotronContainer />
    </>
  );
}
