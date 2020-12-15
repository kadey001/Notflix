import React, { useReducer } from "react";
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
import { VideoContext } from './context/video';
import SearchResults from "./pages/searchResults";

const authInitialState = {
  isAuthenticated: JSON.parse(localStorage.getItem("authenticated")),
  uid: JSON.parse(localStorage.getItem("uid")),
  username: JSON.parse(localStorage.getItem("username")),
  token: JSON.parse(localStorage.getItem("token"))
};
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("LOGIN: ", action.payload.uid, action.payload.username);
      localStorage.setItem("uid", JSON.stringify(action.payload.uid));
      localStorage.setItem("username", JSON.stringify(action.payload.username));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("authenticated", true);
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

const videoInitialState = {
  likedVideos: JSON.parse(localStorage.getItem("likedVideos")),
  listedVideos: JSON.parse(localStorage.getItem("listedVideos")),
};
const videoReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      console.log("UPDATE: ", action.payload);
      localStorage.setItem("likedVideos", JSON.stringify(action.payload.likedVideos));
      localStorage.setItem("listedVideos", JSON.stringify(action.payload.listedVideos));
      return {
        ...state,
        likedVideos: action.payload.likedVideos,
        listedVideos: action.payload.listedVideos
      }
    case "UPDATE LIKED":
      console.log("UPDATE: ", action.payload);
      localStorage.setItem("likedVideos", JSON.stringify(action.payload.likedVideos));
      return {
        ...state,
        likedVideos: action.payload.likedVideos
      }
    case "UPDATE LISTED":
      console.log("UPDATE: ", action.payload);
      localStorage.setItem("listedVideos", JSON.stringify(action.payload.listedVideos));
      return {
        ...state,
        listedVideos: action.payload.likedVideos
      }
    case "CLEAR":
      localStorage.clear();
      return {
        ...state,
        likedVideos: null,
        listedVideos: null
      }
  }
};

export default function App() {
  const [authState, authDispatch] = useReducer(authReducer, authInitialState);
  const [videoState, videoDispatch] = useReducer(videoReducer, videoInitialState);

  return (
    <AuthContext.Provider value={{ state: authState, dispatch: authDispatch }}>
      <VideoContext.Provider value={{ state: videoState, dispatch: videoDispatch }}>
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
          <Route exact path="/search">
            <SearchResults />
          </Route>
        </Router>
      </VideoContext.Provider>
    </AuthContext.Provider>
  );
}
