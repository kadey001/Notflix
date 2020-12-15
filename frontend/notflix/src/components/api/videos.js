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

export const addComment = (vid, uid, username, comment) => {
  console.log(vid, uid, username, comment);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/comment',
    {
      uid: uid,
      vid: vid,
      username: username,
      comment: comment,
    },
    config
  );
}

export const getComments = (vid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/get-comments',
    { vid: vid },
    config
  );
}

// Updaters
export const updateVideoLikes = (uid, vid, increment) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3002/api/update-video-like',
    { uid: uid, vid: vid, increment },
    config
  );
}

// TODO Update to check for previous dislikes first
export const updateVideoDislikes = (uid, vid, increment) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/update-dislikes',
    { uid: uid, vid: vid, increment },
    config
  );
}

export const updateCommentLikes = (cid, uid, increment) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/update-comment-likes',
    { cid: cid, uid: uid, increment },
    config
  );
}

export const updateCommentDislikes = (cid, uid, increment) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/update-comment-dislikes',
    { cid: cid, uid: uid, increment },
    config
  );
}

export const getCommentLikesDislikes = (uid, vid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/video/get-comment-likes-dislikes',
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
