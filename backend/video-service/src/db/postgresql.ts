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

export const addFilm = async ( length: number, title: string, comedy: boolean, horror: boolean, action: boolean): Promise<void> => {
    try {
        let vid: number = 555;              //TODO determine if we want to generate vid here or in video.ts
        const query = {
            text: 'INSERT INTO video(vid, filmlength, title, likes, dislikes, views) VALUES($1, $2, $3, $4, $4, $4);',
            values: [vid,length,title, 0]
        };
        const result = await client.query(query);
        console.log(result);
        const Genrequery = {
            text: 'INSERT INTO genres(vid, comedy, horror, action) VALUES($1, $2, $3, $4);',
            values: [vid, comedy, horror, action]
        };
        const Genreresult = await client.query(Genrequery);
        console.log('Genre Result is: '+Genreresult);
    }catch(error){
        console.log(error);
    }
};

export const addPerson = async (name: string, email: string, password: string, planType?: string): Promise<void> => {      //Let user generate uid? I think we should generate for them
    try {
        let uid: number=12345;
        const query = {
            text: 'INSERT INTO users(uid,username,email,password) VALUES($1, $2, $3, $4);',
            values: [uid,name,email,password]
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
        console.log("Our keyword is :" + keyword);
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


//Also need to check user id as well, turn a dislike into a like if they did that OR have videos
//Have an attribute that keeps track of all the users that have liked it
//OR have users have an attribute that keeps track of videos they've disliked/liked


//TODO if this one is approved, figure out a way to remove a vid from a liked/disliked attribute
//Liked vids is the attribute attached to user, same for disliked vids
/*export const LikeOrDislike = async (vid: number, LikeVote: boolean,uid: number, likedvids: number[], dislikedvids: number[]): Promise<void> => {     //where user has the new attributes
    try {
        let PrevInteract: Boolean = false;
        //If the user DID like the video
        if(LikeVote)
        {
            //Check if the user has previously liked the video in question
            likedvids.forEach(
                //If this if statement has true, then the user has previously liked the video, will then proceed to unlike it
                element => if(element===vid)
                {
                    PrevInteract = true;
                    const query = {
                    text: 'UPDATE Videos SET Videos.Likes = Videos.Likes - 1 WHERE Videos.vid = vid VALUES($1)',
                    values: [vid]
                    }
                    const result = await client.query(query);
                    console.log(result);
                }
                )
            //If the previous forEach did not find that the user previously liked the video, check if the user previously disliked the video
            dislikedvids.forEach(
                //If this if statement has true, then the user has previously disliked the video, will then proceed to like it
                element => if(element===vid)
                {
                    PrevInteract = true;
                    const query = {
                    text: 'UPDATE Videos SET Videos.Dislikes = Videos.Dislikes - 1, Videos.Likes = Videos.Likes + 1 WHERE Videos.vid = vid VALUES($1)',
                    values: [vid]
                    }
                    const result = await client.query(query);
                    console.log(result);
                }
                )
                //If the user has not interacted with the video at all
                //Need to somehow figure out how to pop or push a vid into the users like or dislike attribute array
            if(PrevInteract === false)
            {
                const query = {
                text: 'UPDATE Videos SET Videos.Likes = Videos.Likes + 1 WHERE Videos.vid = vid VALUES($1)',
                values: [vid]
                }
                const result = await client.query(query);
                console.log(result);
            }
        }
        else
        {

        }
    } catch (err) {
        console.error(err);
    }
};

//Below version is for if we keep track of users likes/dislikes onto the video itself, so video will have more attributes

/*export const LikeOrDislikeV2 = async (vid: number, LikeVote: boolean,uid: number, likedby: number[], dislikedby: number[]): Promise<void> => {
    try {
        let PrevInteract: Boolean = false;
        //If the user DID like the video, so LikeVote is equal to true
        if(LikeVote)
        {
            //Check if the video has been liked the the current user
            likedby.forEach(
                //If this if statement has true, then video has been previously liked by the user
                element => if(element===uid)
                {
                    UPDATE Customers
                    SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
                    WHERE CustomerID = 1;
                    PrevInteract = true;
                    const query = {
                    text: 'UPDATE Videos SET Videos.Likes = Videos.Likes - 1 WHERE Videos.vid = vid VALUES($1)',
                    values: [vid]
                    }
                    const result = await client.query(query);
                    console.log(result);
                }
                )
            //If the previous forEach did not find a uid that belonged to the current user, check if the current user's uid is in the dislike attribute
            dislikedby.forEach(
                //If this if statement has true, then video has been previously disliked by the user
                element => if(element===uid)
                {
                    PrevInteract = true;
                    const query = {
                    text: 'UPDATE Videos SET Videos.Dislikes = Videos.Dislikes - 1, Videos.Likes = Videos.Likes + 1 WHERE Videos.vid = vid VALUES($1)',
                    values: [vid]
                    }
                    const result = await client.query(query);
                    console.log(result);
                }
                )
                //User has not interacted with video at all
                //Need to somehow push uid into the likedBy attribute, if this is chosen
            if(PrevInteract === false)
            {
                const query = {
                text: 'UPDATE Videos SET Videos.Likes = Videos.Likes + 1 WHERE Videos.vid = vid VALUES($1)',
                values: [vid]
                }
                const result = await client.query(query);
                console.log(result);
            }
        }
        else
        {

        }
    } catch (err) {
        console.error(err);
    }
};*/