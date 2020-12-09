import React, { useState } from "react";
import { HeaderContainer } from "../containers/header";
import { Form } from "../components";
import axios from "axios";
import { useHistory } from "react-router-dom";

async function signup(userData) {
  const config = {
    headers: {
      "Content-Type": "application/json"
    },
  };
  return axios.post(
    "http://13.77.174.221:3001/auth/sign-up",
    {
      username: userData.username,
      email: userData.email,
      password: userData.password
    },
    config
  );
}

export default function Signup() {
  const history = useHistory();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const isInvalid =
    userData.username === "" ||
    userData.password === "" ||
    userData.email === "";

  const handleSignUp = (event) => {
    event.preventDefault();
    signup(userData).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.error(err);
      setError(err.message);
    });

    console.log(userData);
  };

  return (
    <HeaderContainer>
      <Form>
        <Form.Title> Sign Up </Form.Title>
        {error && <Form.Error>{error}</Form.Error>}

        <Form.Base onSubmit={handleSignUp} method="POST">
          <Form.Input
            placeholder="User name"
            value={userData.userName}
            onChange={({ target }) =>
              setUserData({ ...userData, username: target.value })
            }
          />
          <Form.Input
            placeholder="Email address"
            value={userData.emailAddress}
            onChange={({ target }) =>
              setUserData({ ...userData, email: target.value })
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
