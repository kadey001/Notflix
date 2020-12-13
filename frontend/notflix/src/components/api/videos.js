import axios from 'axios';

export const getTop = () => {
  return axios.get('http://13.77.174.221:3001/videos/top-videos');
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
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post(
    'http://13.77.174.221:3001/videos/filter-genre',
    {
      keyword: keyword
    },
    config
  );
}

export const countView = (vid) => {
  return axios.get(`http://13.77.174.221:3001/videos/filter-genre?${vid}`);
}