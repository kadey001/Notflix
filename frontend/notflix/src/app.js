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
      // console.log("LOGIN: ", action.payload.uid, action.payload.username);
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
  genres: JSON.parse(localStorage.getItem("genres"))
};
const videoReducer = (state, action) => {
  switch (action.type) {
    // console.log("UPDATE: ", action.type, action.payload);
    case "UPDATE":
      localStorage.setItem("likedVideos", JSON.stringify(action.payload.likedVideos));
      localStorage.setItem("listedVideos", JSON.stringify(action.payload.listedVideos));
      return {
        ...state,
        likedVideos: action.payload.likedVideos,
        listedVideos: action.payload.listedVideos
      }
    case "UPDATE LIKED":
      localStorage.setItem("likedVideos", JSON.stringify(action.payload.likedVideos));
      return {
        ...state,
        likedVideos: action.payload.likedVideos
      }
    case "ADD LIKED":
      const updatedLikedListAdded = [...state.likedVideos, action.payload.videoMetadata];
      localStorage.setItem("likedVideos", JSON.stringify(updatedLikedListAdded));
      return {
        ...state,
        likedVideos: updatedLikedListAdded
      }
    case "REMOVE LIKED":
      const updatedLikedListRemoved = [];
      for (let i = 0; i < state.likedVideos.length; i++) {
        if (state.likedVideos[i].vid !== action.payload.vid) {
          updatedLikedListRemoved.push(state.likedVideos[i]);
        }
      }
      localStorage.setItem("likedVideos", JSON.stringify(updatedLikedListRemoved));
      return {
        ...state,
        likedVideos: updatedLikedListRemoved
      }
    case "UPDATE LISTED":
      localStorage.setItem("listedVideos", JSON.stringify(action.payload.listedVideos));
      return {
        ...state,
        listedVideos: action.payload.listedVideos
      }
    case "REMOVE FROM LIST":
      const updatedList = [];
      for (let i = 0; i < state.listedVideos.length; i++) {
        if (state.listedVideos[i].vid !== action.payload.vid) {
          updatedList.push(state.listedVideos[i]);
        }
      }
      // console.log('Updated List:', updatedList)
      localStorage.setItem("listedVideos", JSON.stringify(updatedList));
      // console.log('Local Storage Updated')
      return {
        ...state,
        listedVideos: updatedList
      }
    case "UPDATE GENRES":
      localStorage.setItem("genres", JSON.stringify(action.payload.genres));
      return {
        ...state,
        genres: action.payload.genres
      }
    case "CLEAR":
      localStorage.clear();
      return {
        ...state,
        likedVideos: null,
        listedVideos: null,
        genres: null
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
          {/* <Route exact path="/subscriptions">
            <Subscriptions />
          </Route> */}
          <Route exact path="/search">
            <SearchResults />
          </Route>
        </Router>
      </VideoContext.Provider>
    </AuthContext.Provider>
  );
}
