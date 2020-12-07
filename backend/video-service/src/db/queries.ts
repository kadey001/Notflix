import bcrypt from 'bcrypt';
import { client } from './postgresql';

export interface Auth {
  username: string;
  email: string;
  password: string;
  token: string;
}
export interface Genres {
  comedy: boolean,
  horror: boolean,
  action: boolean,
  drama: boolean,
  fantasy: boolean,
  documentary: boolean,
};

export interface MovieInfo extends Genres { title: string, description: string, length: number, releaseDate: Date };

export const addFilm = async (movieInfo: MovieInfo): Promise<void> => {
  try {
    const query = {
      text: 'INSERT INTO videos(filmlength, description, title, released, likes, dislikes, views) VALUES($1, $2, $3, $4, 0, 0, 0) RETURNING vid;',
      values: [movieInfo.length, movieInfo.description, movieInfo.title, movieInfo.releaseDate]
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
    console.log('Genre Result is: ' + Genreresult);
  } catch (error) {
    console.log(error);
  }
};

export const addPerson = async (name: string, email: string, password: string, planType?: string): Promise<void> => {      //Let user generate uid? I think we should generate for them
  try {
    const query = {
      text: 'INSERT INTO users(username,email,password) VALUES($1, $2, $3);',
      values: [name, email, password]
    };
    const result = await client.query(query);
    console.log(result);
    /*const Planquery = {
        text: 'INSERT INTO plan(type) VALUES($1)',
        values: [planType]
    };
    const Planresult = await client.query(query);
    console.log(result);*/
  } catch (err) {
    console.error(err);
  }
};

export const signUp = async (auth: Auth) => {
  try {
    const query = {
      text: 'INSERT INTO users(username, email, password, token, created, plantype) VALUES($1, $2, $3, $4, $5, $6)',
      values: [auth.username, auth.email, auth.password, auth.token, new Date(), 0]
    }
    const result = await client.query(query);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

export const signIn = async (auth: Auth) => {
  try {
    const query = {
      text: 'SELECT username, password, token FROM users WHERE email = $1 RETURNING',
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
      text: 'UPDATE users SET token = $1 WHERE id = $2 RETURNING uid, username, token',
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
      text: 'SELECT title FROM videos WHERE vid IN (SELECT vid FROM Genres WHERE comedy = $1 AND horror = $2 AND action = $3);',
      values: [genres.comedy,
      genres.horror,
      genres.action,
      genres.drama,
      genres.fantasy,
      genres.documentary
      ]
    };
    const { rows } = await client.query(query);
    return rows;
  } catch (err) {
    console.error(err);
  }
};

//higherOrLower is true for higher, false for lower
export const filterviews = async (desiredViews: number, higherOrLower: boolean): Promise<void> => {
  try {
    //filter by videos with a higher viewcount than specified by user in desiredViews
    if (higherOrLower === true) {
      const query = {
        text: 'SELECT title, views FROM videos WHERE views > $1 ORDER BY views',
        values: [desiredViews]
      };
      const result = await client.query(query);
      console.log(result);
    }
    //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
    else {
      const query = {
        text: 'SELECT title, views FROM videos WHERE views < $1 ORDER BY views',
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
        text: 'SELECT title, likes FROM videos WHERE likes > $1 ORDER BY likes',
        values: [desiredLikes]
      };
      const result = await client.query(query);
      console.log(result);
    }
    //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
    else {
      const query = {
        text: 'SELECT title, likes FROM videos WHERE likes < $1 ORDER BY likes',
        values: [desiredLikes]
      };
      const result = await client.query(query);
      console.log(result);
    }
  } catch (err) {
    console.error(err);
  }
};

export const filterKeyword = async (keyword: string, genres: Genres): Promise<any> => {
  try {
    console.log("Our keyword is :" + keyword);
    const query = {
      text: `SELECT videos.vid FROM videos WHERE videos.title LIKE \'%\' || $1 || \'%\' AND vid IN (SELECT vid FROM Genres 
                WHERE comedy = $2 AND horror = $3 AND action = $4 AND drama = $5 AND fantasy = $6 AND documentary = $7)`,
      values: [keyword,
        genres.comedy,
        genres.horror,
        genres.action,
        genres.drama,
        genres.fantasy,
        genres.documentary
      ]
    };
    const result = await client.query(query);
    const { rows } = result;
    const vids: Set<string> = new Set();
    rows.forEach((video) => {
      vids.add(video.vid);
    });
    console.log(vids);
    return vids;
  } catch (err) {
    console.error(err);
  }
};

export const countView = async (vid: string) => {
  try {
    const query = {
      text: 'UPDATE videos'
    }
  } catch (err) {

  }
}
