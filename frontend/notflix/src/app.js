import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  Home,
  Browse,
  Signin,
  Signup,
  Watch,
  Upload,
  Subscriptions,
} from "./pages";
import * as ROUTES from "./constants/routes";
import { AuthContext } from './context/auth';

const initialState = {
  isAuthenticated: localStorage.getItem('authenticated'),
  uid: localStorage.getItem('uid'),
  username: localStorage.getItem('username'),
  token: localStorage.getItem('token')
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("LOGIN: ", action.payload.uid, action.payload.username);
      localStorage.setItem("uid", JSON.stringify(action.payload.uid));
      localStorage.setItem("username", JSON.stringify(action.payload.username));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("authenticated", true)
      return {
        ...state,
        isAuthenticated: true,
        uid: action.payload.uid,
        username: action.payload.username,
        token: action.payload.token
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        uid: null,
        username: null,
        token: null
      };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Router>
        <Route exact path={ROUTES.HOME}>
          <Home />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route exact path="/browse">
          <Browse />
        </Route>
        <Route exact path="/watch/:vid">
          <Watch />
        </Route>
        <Route exact path="/upload">
          <Upload />
        </Route>
        <Route exact path="/subscriptions">
          <Subscriptions />
        </Route>
      </Router>
    </AuthContext.Provider>
  );
}
