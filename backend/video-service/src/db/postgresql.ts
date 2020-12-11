import { Pool, Client } from 'pg';

export const pool = new Pool({
    max: 20,
    connectionTimeoutMillis: 1000, // 1 second
});
export const client = new Client();

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, poolClient) => {
    console.error('Unexpected error on idle client', err);
    console.log('Client: ', poolClient);
    process.exit(-1);
});

export const connectDB = async (): Promise<void> => {
    try {
        await client.connect();
        console.log('Client Connected Successfuly');
    } catch (err) {
        console.error(err);
    }
};

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
      length: number, 
      releaseDate: Date 
    };

  export const addFilm = async (movieInfo: MovieInfo): Promise<void> => {
    try {
      const query = {
        text: 'INSERT INTO video(filmlength, description, title, released, likes, dislikes, views) VALUES($1, $2, $3, $4, 0, 0, 0) RETURNING vid;',
        values: [movieInfo.length, movieInfo.description, movieInfo.title.toLowerCase(), movieInfo.releaseDate]
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

/*export const addFilm = async ( length: number, title: string, comedy: boolean, horror: boolean, action: boolean, releaseDate: string): Promise<void> => {
    try {
        const query = {
            text: "INSERT INTO video(filmlength, title, likes, dislikes, views, released) VALUES($1, $2, $3, $3, $3, $4);",
            values: [length,title.toLowerCase(), 0, releaseDate]
        };
        const result = await client.query(query);
        console.log(result);
        //Insert the newly created vid into the genres, maybe a better way to get the vid aside from title?
        const vidquery = {
            text: 'SELECT vid FROM video WHERE title = $1',
            values: [title]      
        };
        const vidResult = await client.query(vidquery);
        let filmVid: number = (vidResult.rows[0].vid);
        const Genrequery = {
            text: 'INSERT INTO genres(vid, comedy, horror, action) VALUES($1, $2, $3, $4);',
            values: [filmVid, comedy, horror, action]
        };
        const Genreresult = await client.query(Genrequery);
        console.log('Genre Result is: '+Genreresult);
    }catch(error){
        console.log(error);
    }
};*/


export const addPerson = async (userInfo: Auth): Promise<void> => {      //Let user generate uid? I think we should generate for them
    try {
        //Insert relevant user information
        const query = {
            text: 'INSERT INTO users(username,email,password,plantype) VALUES($1, $2, $3, $4);',
            values: [userInfo.username,
                userInfo.email,
                userInfo.password,
                userInfo.plan]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

/*export const addPerson = async (name: string, email: string, password: string, planType: number): Promise<void> => {      //Let user generate uid? I think we should generate for them
    try {
        //Insert relevant user information
        const query = {
            text: 'INSERT INTO users(username,email,password,plantype) VALUES($1, $2, $3, $4);',
            values: [name,email,password,planType]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};*/

export const filterGenre = async (GenreInfo: Genres): Promise<void> => {
    try {
        const query = {
            text: 'SELECT title FROM video WHERE vid IN (SELECT vid FROM Genres WHERE comedy = $1 AND horror = $2 AND action = $3 AND drama = $4 AND fantasy = $5 AND documentary = $6);',
            values: [GenreInfo.comedy,
                    GenreInfo.horror,
                    GenreInfo.action,
                    GenreInfo.drama,
                    GenreInfo.fantasy,
                    GenreInfo.action        
                    ]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

//higherOrLower is true for higher, false for lower
export const filterviews = async (desiredViews: number,higherOrLower: boolean): Promise<void> => {
    try {
        //filter by videos with a higher viewcount than specified by user in desiredViews
        if(higherOrLower===true)
        {
            const query = {
                text: 'SELECT title, views FROM video WHERE views > $1 ORDER BY views',
                values: [desiredViews]
            };
            const result = await client.query(query);
            console.log(result);
        }
        //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
        else
        {
            const query = {
                text: 'SELECT title, views FROM video WHERE views < $1 ORDER BY views',
                values: [desiredViews]
            };
            const result = await client.query(query);
            console.log(result);
        }
    } catch (err) {
        console.error(err);
    }
};

export const filterLikes = async (desiredLikes: number,higherOrLower: boolean): Promise<void> => {
    try {
        //filter by videos with a higher like count than specified by user in desiredLikes
        if(higherOrLower===true)
        {
            const query = {
                text: 'SELECT title, likes FROM video WHERE likes > $1 ORDER BY likes',
                values: [desiredLikes]
            };
            const result = await client.query(query);
            console.log(result);
        }
        //User wants to filter videos that have a lower viewcount than specified by user in desiredViews
        else
        {
            const query = {
                text: 'SELECT title, likes FROM video WHERE likes < $1 ORDER BY likes',
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
            if(GenreInfo[genreType]==true)
            {
                searchGenre=true;
            }
        }
        console.log("searchgenre is "+searchGenre);
        //This is if user wants to search for titles and narrow even further via Genre
        if(searchGenre==true)
        {
            const query = {
                text: 'SELECT Video.title FROM Video WHERE Video.title LIKE \'%\' || $1 || \'%\' AND vid IN (SELECT vid FROM Genres WHERE comedy = $2 AND horror = $3 AND action = $4 AND drama = $5 AND fantasy = $6 AND documentary = $7)',
                values: [keyword,GenreInfo.comedy,GenreInfo.horror,GenreInfo.action,GenreInfo.drama,GenreInfo.fantasy,GenreInfo.documentary]
            };
            const result = await client.query(query);
            console.log(result);
        }
        //User wants to search for titles across all Genres
        else
        {
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

export const incrementView = async ( vid: string ): Promise<void> => {
    try {
        const query = {
            text: 'UPDATE video SET views = views + 1 WHERE vid = $1 ',
            values: [vid]
        };
        const result = await client.query(query);
        console.log(result);
    }catch(error){
        console.log(error);
    }
};

export const changePlan = async ( userID: string, newPlan: number ): Promise<void> => {
    try {
        const query = {
            //text: 'UPDATE users SET plantype = $1;',
            text: 'UPDATE users SET plantype = $1 WHERE CAST( uid AS TEXT)= $2;',
            values: [newPlan,userID]
        };
        const result = await client.query(query);
        console.log(result);
    }catch(error){
        console.log(error);
    }
};