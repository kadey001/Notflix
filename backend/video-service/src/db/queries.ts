import { client } from './postgresql';

export interface Auth {
  username: string;
  email: string;
  password: string;
  token: string;
  plan: number;
}

export interface Genres {
  comedy: boolean,
  horror: boolean,
  action: boolean,
  drama: boolean,
  fantasy: boolean,
  documentary: boolean,
};

export interface MovieInfo extends Genres {
  title: string,
  description: string,
  length: string, // In minutes
  released: string
};

export const addFilm = async (movieInfo: MovieInfo): Promise<string | undefined> => {
  try {
    const query = {
      text: 'INSERT INTO videos(filmlength, description, title, released, likes, dislikes, views) VALUES($1, $2, $3, $4, 0, 0, 0) RETURNING vid;',
      values: [movieInfo.length, movieInfo.description, movieInfo.title.toLowerCase(), new Date(movieInfo.released)]
    };
    const result = await client.query(query);
    const vid = result.rows[0].vid;
    const Genrequery = {
      text: 'INSERT INTO genres(vid, comedy, horror, action, drama, fantasy, documentary) VALUES($1, $2, $3, $4, $5, $6, $7);',
      values: [vid,
        movieInfo.comedy,
        movieInfo.horror,
        movieInfo.action,
        movieInfo.drama,
        movieInfo.fantasy,
        movieInfo.documentary
      ]
    };
    const Genreresult = await client.query(Genrequery);
    console.log(Genreresult);
    return vid;
  } catch (error) {
    console.log(error);
  }
};

export const checkExisting = async (email: string) => {      //Let user generate uid? I think we should generate for them
  try {
    const query = {
      text: 'SELECT uid FROM users WHERE email = $1;',
      values: [email]
    };
    const { rows } = await client.query(query);
    if (rows.length === 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.error(err);
  }
};

export const signUp = async (auth: Auth) => {
  try {
    const query = {
      text: 'INSERT INTO users(username, email, password, token, created, plantype) VALUES($1, $2, $3, $4, $5, $6) RETURNING uid;',
      values: [auth.username, auth.email, auth.password, auth.token, new Date(), 0]
    }
    const { rows } = await client.query(query);
    return rows[0].uid;
  } catch (err) {
    console.error(err);
  }
}

export const signIn = async (auth: Auth) => {
  try {
    const query = {
      text: 'SELECT username, password, token FROM users WHERE email = $1 RETURNING uid;',
      values: [auth.email]
    }
    const { rows } = await client.query(query);
    console.log(rows);
    const response = rows[0];
    return response;
  } catch (err) {
    console.error(err);
  }
}

export const updateUserToken = async (token: string, uid: string) => {
  try {
    const query = {
      text: 'UPDATE users SET token = $1 WHERE id = $2 RETURNING uid, username, token;',
      values: [token, uid]
    }
    const { rows } = await client.query(query);
    const response = rows[0];
    return response;
  } catch (err) {
    console.error(err);
  }
}

export const filterGenre = async (genres: Genres): Promise<any> => {
  try {
    const query = {
      text: `SELECT vid FROM videos WHERE vid IN 
        (SELECT vid FROM Genres WHERE comedy = $1 AND horror = $2 AND action = $3 AND drama = $4 AND fantasy = $5 AND documentary = $6);`,
      values: [genres.comedy,
      genres.horror,
      genres.action,
      genres.drama,
      genres.fantasy,
      genres.documentary
      ]
    };
    const { rows } = await client.query(query);
    const vids: Set<string> = new Set();
    rows.forEach((video) => {
      vids.add(video.vid);
    });
    return vids;
  } catch (err) {
    console.error(err);
  }
};

//higherOrLower is true for higher, false for lower
export const filterViews = async (desiredViews: number, higherOrLower: boolean): Promise<void> => {
  try {
    //filter by videos with a higher viewcount than specified by user in desiredViews
    if (higherOrLower === true) {
      const query = {
        text: 'SELECT title, views FROM videos WHERE views > $1 ORDER BY views;',
        values: [desiredViews]
      };
      const result = await client.query(query);
      console.log(result);
    }
    //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
    else {
      const query = {
        text: 'SELECT title, views FROM videos WHERE views < $1 ORDER BY views;',
        values: [desiredViews]
      };
      const result = await client.query(query);
      console.log(result);
    }
  } catch (err) {
    console.error(err);
  }
};

export const filterLikes = async (desiredLikes: number, higherOrLower: boolean): Promise<void> => {
  try {
    //filter by videos with a higher like count than specified by user in desiredLikes
    if (higherOrLower === true) {
      const query = {
        text: 'SELECT title, likes FROM videos WHERE likes > $1 ORDER BY likes;',
        values: [desiredLikes]
      };
      const result = await client.query(query);
      console.log(result);
    }
    //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
    else {
      const query = {
        text: 'SELECT title, likes FROM videos WHERE likes < $1 ORDER BY likes;',
        values: [desiredLikes]
      };
      const result = await client.query(query);
      console.log(result);
    }
  } catch (err) {
    console.error(err);
  }
};

export const filterKeyword = async (keyword: string, GenreInfo: Genres): Promise<void> => {
  try {
    //Check if all Genres are false, means user wants to search across all Genres
    let index = 0;
    let searchGenre = false;
    for (const genreType in GenreInfo) {
      // @ts-ignore
      if (GenreInfo[genreType] == true) {
        searchGenre = true;
      }
    }
    console.log("searchgenre is " + searchGenre);
    //This is if user wants to search for titles and narrow even further via Genre
    if (searchGenre == true) {
      const query = {
        text: 'SELECT Video.title FROM Video WHERE Video.title LIKE \'%\' || $1 || \'%\' AND vid IN (SELECT vid FROM Genres WHERE comedy = $2 AND horror = $3 AND action = $4 AND drama = $5 AND fantasy = $6 AND documentary = $7)',
        values: [keyword, GenreInfo.comedy, GenreInfo.horror, GenreInfo.action, GenreInfo.drama, GenreInfo.fantasy, GenreInfo.documentary]
      };
      const result = await client.query(query);
      console.log(result);
    }
    //User wants to search for titles across all Genres
    else {
      const query = {
        text: 'SELECT Video.title FROM Video WHERE Video.title LIKE \'%\' || $1 || \'%\'',
        values: [keyword]
      };
      const result = await client.query(query);
      console.log(result);
    }
  } catch (err) {
    console.error(err);
  }
};

export const topVids = async (desiredVideos: number): Promise<void> => {
  try {
    //Could pull more information from videos than just title, just need to modify query
    const query = {
      text: 'SELECT title, views FROM video ORDER BY views DESC LIMIT $2;',
      values: [desiredVideos]
    };
    const result = await client.query(query);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
};

export const countView = async (vid: string) => {
  try {
    const query = {
      text: 'UPDATE videos SET views = views + 1 WHERE vid = $1 RETURNING views;',
      values: [vid]
    }
    const { rows } = await client.query(query);
    return rows[0];
  } catch (err) {

  }
}

export const changePlan = async (userID: string, newPlan: number): Promise<void> => {
  try {
    const query = {
      //text: 'UPDATE users SET plantype = $1;',
      text: 'UPDATE users SET plantype = $1 WHERE CAST( uid AS TEXT)= $2;',
      values: [newPlan, userID]
    };
    const result = await client.query(query);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
