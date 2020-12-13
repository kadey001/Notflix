import React, { useContext, useState } from "react";
import { HeaderContainer } from "../containers/header";
import { Form } from "../components";
import { AuthContext } from '../context/auth';
import { Redirect, useHistory } from "react-router-dom";
import axios from 'axios';

async function signin(userData) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    "http://13.77.174.221:3001/auth/sign-in",
    {
      email: userData.email,
      password: userData.password,
    },
    config
  );
}

export default function Signin() {
  const { state, dispatch } = React.useContext(AuthContext);
  const history = useHistory();
  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const isInvalid = userData.password === "" || userData.email === "";
  const handleSignIn = (event) => {
    event.preventDefault();
    signin(userData).then((result) => {
      dispatch({
        type: "LOGIN",
        payload: {
          uid: result.data.uid,
          username: result.data.username,
          token: result.data.token
        }
      })
      console.log(state)
      history.push('/browse');
    }).catch((err) => {
      console.error(err);
      if (err.response)
        setError(err.response.statusText);
      else
        setError(err.message);
    });
  };
  return (
    <div>
      {!state.isAuthenticated ?
        <HeaderContainer>
          <Form>
            <Form.Title> Sign In </Form.Title>
            {error && <Form.Error>{error}</Form.Error>}

            <Form.Base onSubmit={handleSignIn} method="POST">
              <Form.Input
                type="email"
                placeholder="Email address"
                value={userData.email}
                onChange={({ target }) => setUserData({ ...userData, email: target.value })}
              />
              <Form.Input
                type="password"
                autoComplete="off"
                placeholder="Password"
                value={userData.password}
                onChange={({ target }) => setUserData({ ...userData, password: target.value })}
              />
              <Form.Submit disabled={isInvalid} type="submit">
                Sign In
            </Form.Submit>
            </Form.Base>

            <Form.Text>
              New to Notflix? <Form.Link to="/signup">Sign up now. </Form.Link>
            </Form.Text>
          </Form>
        </HeaderContainer>
        :
        <Redirect to='/browse' />
      }
    </div>
  );
}
