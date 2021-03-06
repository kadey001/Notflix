import { client } from './postgresql';

export interface Auth {
  username: string;
  email: string;
  password: string;
  token: string;
  plan: number;
}

export interface Genres {
  comedy?: boolean,
  horror?: boolean,
  action?: boolean,
  drama?: boolean,
  fantasy?: boolean,
  documentary?: boolean,
};

export interface MovieInfo extends Genres {
  title: string,
  description: string,
  length: string, // In minutes
  released: string
};

export interface MetaData {
  vid: string;
  img: string;
  title: string;
  description: string;
  length: number;
  released: Date;
  likes: number;
  dislikes: number;
  views: number;
  genres: Genres
}

export interface Comment {
  uid: string;
  vid: string;
  username: string;
  comment: string;
  likes?: number;
  dislikes?: number;
}

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
      text: 'INSERT INTO users(username, email, password, token, created, plantype) VALUES($1, $2, $3, $4, $5, $6) RETURNING uid, username, token;',
      values: [auth.username, auth.email, auth.password, auth.token, new Date(), 0]
    }
    const { rows } = await client.query(query);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
}

export const signIn = async (auth: Auth) => {
  try {
    const query = {
      text: 'SELECT uid, username, password, token FROM users WHERE email = $1',
      values: [auth.email]
    }
    const { rows } = await client.query(query);
    return rows[0];
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

const defaultGenres = {
  comedy: false,
  horror: false,
  action: false,
  drama: false,
  fantasy: false,
  documentary: false,
}

export const filterGenre = async (genres: Genres): Promise<any> => {
  try {
    const vids: Array<MetaData> = [];
    if (genres.comedy) {
      const comedyQuery = {
        text: `SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid IN 
          (SELECT vid FROM Genres WHERE comedy = $1);`,
        values: [genres.comedy]
      };
      const comedyResult = await client.query(comedyQuery);
      comedyResult.rows.forEach((video) => {
        vids.push({
          ...video,
          img: `https://www.notflix.tech/webhdfs/v1/home/videos/${video.vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`,
          genres: genres
        });
      });
    }
    if (genres.action) {
      const actionQuery = {
        text: `SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid IN 
        (SELECT vid FROM Genres WHERE action = $1);`,
        values: [genres.action]
      };
      const actionResult = await client.query(actionQuery);
      actionResult.rows.forEach((video) => {
        vids.push({
          ...video,
          img: `https://www.notflix.tech/webhdfs/v1/home/videos/${video.vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`,
          genres: genres
        });
      });
    }
    if (genres.drama) {
      const dramaQuery = {
        text: `SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid IN 
        (SELECT vid FROM Genres WHERE drama = $1);`,
        values: [genres.drama]
      };
      const dramaResult = await client.query(dramaQuery);
      dramaResult.rows.forEach((video) => {
        vids.push({
          ...video,
          img: `https://www.notflix.tech/webhdfs/v1/home/videos/${video.vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`,
          genres: genres
        });
      });
    }
    if (genres.fantasy) {
      const fantasyQuery = {
        text: `SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid IN 
        (SELECT vid FROM Genres WHERE fantasy = $1);`,
        values: [genres.fantasy]
      };
      const fantasyResult = await client.query(fantasyQuery);
      fantasyResult.rows.forEach((video) => {
        vids.push({
          ...video,
          img: `https://www.notflix.tech/webhdfs/v1/home/videos/${video.vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`,
          genres: genres
        });
      });
    }
    if (genres.horror) {
      const horrorQuery = {
        text: `SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid IN 
        (SELECT vid FROM Genres WHERE horror = $1);`,
        values: [genres.horror]
      };
      const horrorResult = await client.query(horrorQuery);
      horrorResult.rows.forEach((video) => {
        vids.push({
          ...video,
          img: `https://www.notflix.tech/webhdfs/v1/home/videos/${video.vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`,
          genres: genres
        });
      });
    }
    if (genres.documentary) {
      const documentaryQuery = {
        text: `SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid IN 
        (SELECT vid FROM Genres WHERE documentary = $1);`,
        values: [genres.documentary]
      };
      const documentaryResult = await client.query(documentaryQuery);
      documentaryResult.rows.forEach((video) => {
        vids.push({
          ...video,
          img: `https://www.notflix.tech/webhdfs/v1/home/videos/${video.vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0`,
          genres: genres
        });
      });
    }
    return vids;
  } catch (err) {
    console.error(err);
  }
};

//higherOrLower is true for higher, false for lower
export const filterViews = async (desiredViews: number, higherOrLower: boolean): Promise<any> => {
  try {
    //filter by videos with a higher viewcount than specified by user in desiredViews
    if (higherOrLower === true) {
      const query = {
        text: 'SELECT vid FROM videos WHERE views > $1 ORDER BY views;',
        values: [desiredViews]
      };
      const { rows } = await client.query(query);
      const vids: Set<string> = new Set();
      rows.forEach((video) => {
        vids.add(video.vid);
      });
      return vids;
    }
    //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
    else {
      const query = {
        text: 'SELECT vid FROM videos WHERE views < $1 ORDER BY views;',
        values: [desiredViews]
      };
      const { rows } = await client.query(query);
      const vids: Set<string> = new Set();
      rows.forEach((video) => {
        vids.add(video.vid);
      });
      return vids;
    }
  } catch (err) {
    console.error(err);
  }
};

export const filterLikes = async (desiredLikes: number, higherOrLower: boolean): Promise<any> => {
  try {
    //filter by videos with a higher like count than specified by user in desiredLikes
    if (higherOrLower === true) {
      const query = {
        text: 'SELECT title, likes FROM videos WHERE likes > $1 ORDER BY likes;',
        values: [desiredLikes]
      };
      const { rows } = await client.query(query);
      const vids: Set<string> = new Set();
      rows.forEach((video) => {
        vids.add(video.vid);
      });
      return vids;
    }
    //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
    else {
      const query = {
        text: 'SELECT title, likes FROM videos WHERE likes < $1 ORDER BY likes;',
        values: [desiredLikes]
      };
      const { rows } = await client.query(query);
      const vids: Set<string> = new Set();
      rows.forEach((video) => {
        vids.add(video.vid);
      });
      return vids;
    }
  } catch (err) {
    console.error(err);
  }
};

export const filterKeyword = async (keyword: string): Promise<any> => {
  try {
    const queryText = `SELECT vid FROM Videos WHERE Videos.title LIKE \'%${keyword}\' OR Videos.title LIKE \'%${keyword}%\' OR Videos.title LIKE \'${keyword}%\'`;
    const query = {
      text: queryText,
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

export const topVids = async (desiredVideos: number): Promise<any> => {
  try {
    //Could pull more information from videos than just title, just need to modify query
    const query = {
      text: 'SELECT vid FROM videos ORDER BY views DESC LIMIT $1;',
      values: [desiredVideos]
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

export const countView = async (vid: string) => {
  try {
    const query = {
      text: 'UPDATE videos SET views = views + 1 WHERE vid = $1 RETURNING views;',
      values: [vid]
    }
    const { rows } = await client.query(query);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
}

export const updateVideoLikes = async (vid: string, increment: boolean) => {
  try {
    if (increment) {
      const query = {
        text: 'UPDATE videos SET likes = likes + 1 WHERE vid = $1 RETURNING likes;',
        values: [vid]
      }
      const { rows } = await client.query(query);
      return rows[0];
    } else {
      const query = {
        text: 'UPDATE videos SET likes = likes - 1 WHERE vid = $1 RETURNING likes;',
        values: [vid]
      }
      const { rows } = await client.query(query);
      return rows[0];
    }
  } catch (err) {
    console.error(err);
  }
}

export const updateVideoDislikes = async (vid: string, increment: boolean) => {
  try {
    if (increment) {
      const query = {
        text: 'UPDATE videos SET dislikes = dislikes + 1 WHERE vid = $1 RETURNING likes;',
        values: [vid]
      }
      const { rows } = await client.query(query);
      return rows[0];
    } else {
      const query = {
        text: 'UPDATE videos SET dislikes = dislikes - 1 WHERE vid = $1 RETURNING likes;',
        values: [vid]
      }
      const { rows } = await client.query(query);
      return rows[0];
    }
  } catch (err) {
    console.error(err);
  }
}

export const addComment = async (comment: Comment) => {
  try {
    const query = {
      text: `INSERT INTO comments(vid, uid, username, comment, likes, dislikes, timestamp) 
      VALUES('${comment.vid}', '${comment.uid}', '${comment.username}', '${comment.comment}', 0, 0, '${new Date().toUTCString()}') 
      RETURNING cid;`
    }
    const { rows } = await client.query(query);
    return rows[0];
  } catch (err) {
    console.error(err);
  }
}

export const getComments = async (vid: string) => {
  try {
    const query = {
      text: 'SELECT * FROM comments WHERE vid = $1',
      values: [vid]
    }
    const { rows } = await client.query(query);
    return rows;
  } catch (err) {
    console.error(err);
  }
}

export const updateCommentLike = async (cid: string, uid: string, increment: boolean) => {
  try {
    console.log(cid, uid, increment);
    let entryExists = false;
    // Check if comment is already liked
    const ratingQuery = {
      text: `SELECT * FROM comment_rated WHERE cid = '${cid}' AND uid = '${uid}';`,
    }
    const { rows } = await client.query(ratingQuery);
    console.log(rows);
    if (rows.length !== 0) {
      if (rows[0].liked === 'true' || rows[0].disliked === 'true') return;
      entryExists = true;
    }

    if (increment) {
      // Update comment_rated table
      if (entryExists) {
        const query = {
          text: `UPDATE comment_rated SET liked = true WHERE cid = '${cid}' AND uid = '${uid}';`,
        }
        await client.query(query);
      } else {
        const query = {
          text: `INSERT INTO comment_rated(cid, uid, liked, disliked) VALUES('${cid}', '${uid}', true, false);`,
        }
        await client.query(query);
      }
      // Update comment table
      const commentQuery = {
        text: `UPDATE comments SET likes = likes + 1 WHERE cid = '${cid}';`,
      }
      await client.query(commentQuery);
    } else {
      // Update comment_rated Table
      if (entryExists) {
        const query = {
          text: `UPDATE comment_rated SET liked = false WHERE cid = '${cid}' AND uid = '${uid}';`,
        }
        await client.query(query);
      } else {
        const query = {
          text: `INSERT INTO comment_rated(cid, uid, liked, disliked) VALUES('${cid}', '${uid}', false, false);`,
        }
        await client.query(query);
      }
      // Update comment table
      const commentQuery = {
        text: `UPDATE comments SET likes = likes - 1 WHERE cid = '${cid}';`,
      }
      await client.query(commentQuery);
    }
  } catch (err) {
    console.error(err);
  }
}

export const updateCommentDislike = async (cid: string, uid: string, increment: boolean) => {
  try {
    let entryExists = false;
    // Check if comment is already liked
    const ratingQuery = {
      text: `SELECT disliked FROM comment_rated WHERE cid = '${cid}' AND uid = '${uid}';`,
    }
    const { rows } = await client.query(ratingQuery);
    if (rows.length !== 0) {
      if (rows[0].disliked === 'true' || rows[0].disliked === 'true') return;
      entryExists = true;
    }

    if (increment) {
      // Update comment_rated Table
      if (entryExists) {
        const query = {
          text: `UPDATE comment_rated SET disliked = true WHERE cid = '${cid}' AND uid = '${uid}';`,
        }
        await client.query(query);
      } else {
        const query = {
          text: `INSERT INTO comment_rated(cid, uid, liked, disliked) VALUES('${cid}', '${uid}', false, true);`,
        }
        await client.query(query);
      }
      // Update comment table
      const commentQuery = {
        text: `UPDATE comments SET dislikes = dislikes + 1 WHERE cid = '${cid}';`,
      }
      await client.query(commentQuery);
    } else {
      // Update comment_rated Table
      if (entryExists) {
        const query = {
          text: `UPDATE comment_rated SET disliked = false WHERE cid = '${cid}' AND uid = '${uid}';`,
        }
        await client.query(query);
      } else {
        const query = {
          text: `INSERT INTO comment_rated(cid, uid, liked, disliked) VALUES('${cid}', '${uid}', false, false);`,
        }
        await client.query(query);
      }
      // Update comment table
      const commentQuery = {
        text: `UPDATE comments SET dislikes = dislikes - 1 WHERE cid = '${cid}';`,
      }
      await client.query(commentQuery);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getCommentLikesDislikes = async (vid: string, uid: string) => {
  const query = {
    text: `SELECT cid, liked, disliked FROM comment_rated WHERE comment_rated.uid = '${uid}' AND comment_rated.cid IN(SELECT comments.cid FROM comments WHERE comments.vid = '${vid}');`
  }
  const { rows } = await client.query(query);
  return rows;
};

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

export const metadata = async (vid: string) => {
  try {
    const videoQuery = {
      text: 'SELECT vid, title, filmlength, description, likes, dislikes, views, released FROM videos WHERE vid = $1',
      values: [vid]
    }
    const videoResult = await client.query(videoQuery);
    const genreQuery = {
      text: 'SELECT comedy, horror, action, drama, fantasy, documentary FROM Genres WHERE vid = $1',
      values: [vid]
    }
    const genreResult = await client.query(genreQuery);
    const result: MetaData = { ...videoResult.rows[0], genres: { ...genreResult.rows[0] }, img: `https://www.notflix.tech/webhdfs/v1/home/videos/${vid}/thumbnail.jpg?op=OPEN&user.name=main&namenoderpcaddress=notflix:8020&offset=0` }
    return result;
  } catch (err) {
    console.log(err);
  }
}
