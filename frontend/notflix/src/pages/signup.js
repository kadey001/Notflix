import React, { useState } from "react";
import { HeaderContainer } from "../containers/header";
import { Form } from "../components";
import * as ROUTES from "../constants/routes";
import { useHistory } from "react-router-dom";

export default function Signup() {
  const history = useHistory();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  const [error, setError] = useState("");
  const isInvalid =
    userData.firstName === "" ||
    userData.lastName === "" ||
    userData.password === "" ||
    userData.emailAddress === "";

  const handleSignUp = (event) => {
    event.preventDefault();
    //handle signup request here
    const options = {};
    console.log(userData);
  };

  return (
    <HeaderContainer>
      <Form>
        <Form.Title> Sign Up </Form.Title>
        {error && <Form.Error>{error}</Form.Error>}

        <Form.Base onSubmit={handleSignUp} method="POST">
          <Form.Input
            placeholder="First name"
            value={userData.firstName}
            onChange={({ target }) =>
              setUserData({ ...userData, firstName: target.value })
            }
          />
          <Form.Input
            placeholder="Last name"
            value={userData.lastName}
            onChange={({ target }) =>
              setUserData({ ...userData, lastName: target.value })
            }
          />
          <Form.Input
            placeholder="Email address"
            value={userData.emailAddress}
            onChange={({ target }) =>
              setUserData({ ...userData, emailAddress: target.value })
            }
          />
          <Form.Input
            type="password"
            autoComplete="off"
            placeholder="Password"
            value={userData.password}
            onChange={({ target }) =>
              setUserData({ ...userData, password: target.value })
            }
          />
          <Form.Submit disabled={isInvalid} type="submit">
            Sign Up
          </Form.Submit>
        </Form.Base>

        <Form.Text>
          Already a user? <Form.Link to="/signin">Sign in now. </Form.Link>
        </Form.Text>
      </Form>
    </HeaderContainer>
  );
}
