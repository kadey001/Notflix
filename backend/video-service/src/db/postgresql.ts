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

// TODO move to its own query file
/*export const addPerson = async (name: string): Promise<void> => {
    try {
        const query = {
            text: 'INSERT INTO test(username) VALUES($1)',
            values: [name]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};*/

export const addFilm = async ( length: number, title: string, comedy: boolean, horror: boolean, action: boolean, releaseDate: string): Promise<void> => {
    try {
        /*const vidquery = {
            text: 'SELECT vid FROM video ORDER BY vid DESC;',      
        };
        const vidResult = await client.query(vidquery);
        let filmVid: number = (vidResult.rows[0].vid);
        filmVid++;
        console.log("The result is " + filmVid);*/
        const query = {
            text: "INSERT INTO video(filmlength, title, likes, dislikes, views, released) VALUES($1, $2, $3, $3, $3, $4);",
            values: [length,title, 0, releaseDate]
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
};

export const addPerson = async (name: string, email: string, password: string, planType: number): Promise<void> => {      //Let user generate uid? I think we should generate for them
    try {
        //Insert relevant user information
        const query = {
            text: 'INSERT INTO users(username,email,password,plantype) VALUES($1, $2, $3, $4);',
            values: [name,email,password,planType]
        };
        const result = await client.query(query);
        console.log(result);
        //Grab the uid generated to insert into plan
        const uidquery = {
            text: 'SELECT uid FROM users WHERE username = $1 AND password = $2;',
            values: [name,password]      
        };
        const uidResult = await client.query(uidquery);
        console.log(uidResult);
        const Planquery = {
            text: 'INSERT INTO plan SELECT uid, plantype FROM users;',
        };
        const planResult = await client.query(Planquery);
        console.log(planResult);
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

export const filterGenre = async (comedyGenre: boolean, horrorGenre: boolean, actionGenre: boolean): Promise<void> => {
    try {
        const query = {
            text: 'SELECT title FROM video WHERE vid IN (SELECT vid FROM Genres WHERE comedy = $1 AND horror = $2 AND action = $3);',
            values: [comedyGenre,horrorGenre,actionGenre]
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

export const filterKeyword = async (keyword: string, comedyGenre: boolean, horrorGenre: boolean, actionGenre: boolean): Promise<void> => {
    try {
        const query = {
            text: 'SELECT Video.title FROM Video WHERE Video.title LIKE \'%\' || $1 || \'%\' AND vid IN (SELECT vid FROM Genres WHERE comedy = $2 AND horror = $3 AND action = $4)',      
            values: [keyword,comedyGenre,horrorGenre,actionGenre]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

export const topVids = async (desiredViews: number,desiredVideos: number): Promise<void> => {
    try {
        const query = {
            text: 'SELECT title FROM video WHERE views > $1 ORDER BY views DESC LIMIT $2;',
            values: [desiredViews,desiredVideos]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

export const getPerson = async (sentEmail: string,sentPassword: string): Promise<void> => {
    try {
        const query = {
            text: 'SELECT * FROM users WHERE email = $1 AND password = $2;',
            values: [sentEmail,sentPassword]
        };
        const result = await client.query(query);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
};

export const incrementView = async ( vid: number ): Promise<void> => {
    try {
        const vidquery = {
            text: 'SELECT views FROM video WHERE vid = $1',
            values: [vid]      
        };
        const vidResult = await client.query(vidquery);
        let viewCount: number = (vidResult.rows[0].views);
        viewCount++;
        const query = {
            text: 'UPDATE video SET views = $1 WHERE vid = $2 ',
            values: [viewCount,vid]
        };
        const result = await client.query(query);
        console.log(result);
    }catch(error){
        console.log(error);
    }
};

export const changePlan = async ( name: string, password: string, newPlan: number ): Promise<void> => {
    try {
        const query = {
            text: 'UPDATE users SET plantype = $3 WHERE username = $1 AND password = $2;',
            values: [name,password,newPlan]
        };
        const result = await client.query(query);
        console.log(result);
        const planquery = {
            text: 'UPDATE plan SET plantype = $3 WHERE uid IN (SELECT users.uid FROM users WHERE username = $1 AND password = $2);',
            values: [name,password,newPlan]
        };
        const planresult = await client.query(planquery);
        console.log(planresult);
    }catch(error){
        console.log(error);
    }
};