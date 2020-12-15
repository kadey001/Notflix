import axios from 'axios';

export const getTop = () => {
  return axios.get('http://13.77.174.221:3001/video/top-videos');
}

// genres is object of booleans
export const getGenre = (genres) => {
  console.log(genres);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/filter-genre',
    genres,
    config
  );
}

export const searchVideos = (keyword) => {
  return axios.get(
    `http://13.77.174.221:3001/video/search?keyword=${keyword}`
  );
}

export const countView = (vid) => {
  return axios.get(`http://13.77.174.221:3001/video/filter-genre?${vid}`);
}

export const addToList = (uid, vid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/add-video-to-list',
    { uid: uid, vid: vid },
    config
  );
}

export const getList = (uid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/get-listed-videos',
    { uid: uid },
    config
  );
}

export const getLiked = (uid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/get-liked-videos',
    { uid: uid },
    config
  );
}

export const getViewed = (uid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/get-viewed-videos',
    { uid: uid },
    config
  );
}

export const getComments = (vid) => {

}

// Updaters
export const likeVideo = (uid, vid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/like-video',
    { uid: uid, vid: vid },
    config
  );
}

export const removeFromList = (uid, vid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/remove-video-from-list',
    { uid: uid, vid: vid },
    config
  );
}
