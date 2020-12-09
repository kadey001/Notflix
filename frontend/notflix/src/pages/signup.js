import React, { useState } from "react";
import { HeaderContainer } from "../containers/header";
import { Form } from "../components";
import * as ROUTES from "../constants/routes";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Signup() {
  const history = useHistory();
  const [userData, setUserData] = useState({
    userName: "",
    emailAddress: "",
    password: "",
  });
  const [error, setError] = useState("");
  const isInvalid =
    userData.userName === "" ||
    userData.password === "" ||
    userData.emailAddress === "";

  const handleSignUp = (event) => {
    event.preventDefault();

    const options = {};
    const formData = new FormData();
    formData.append("username", userData.userName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    return axios.post(
      "http://13.77.174.221:3001/auth/sign-up",
      formData,
      config
    );
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
              setUserData({ ...userData, userName: target.value })
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
