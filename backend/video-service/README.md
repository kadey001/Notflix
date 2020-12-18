# Video Service

A microservice for video streaming

What endpoint it is (what /name)
Description of what it does
What HTTP Method it is (GET, POST, ...)
What request key,value / body is expected
Expected responses

## Interfaces

### 
```typescript
export interface Auth {
  username: string;
  email: string;
  password: string;
  token: string;
  plan: number;
}
```

### 
```typescript
export interface Genres {
  comedy?: boolean,
  horror?: boolean,
  action?: boolean,
  drama?: boolean,
  fantasy?: boolean,
  documentary?: boolean,
};
```

### 
```typescript
export interface MovieInfo extends Genres {
  title: string,
  description: string,
  length: string, // In minutes
  released: string
};
```

### Metadata
```typescript
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
```

### 
```typescript
export interface Comment {
  uid: string;
  vid: string;
  username: string;
  comment: string;
  likes?: number;
  dislikes?: number;
}
```

## /name
###### Description
###### HTTP Method
###### Expected input
###### Expected responses

## /auth/sign-up
###### Description
Adds a new user to the database.
###### HTTP Method
/auth/sign-up is a POST method
###### Expected input
{ username, email, password }
###### Expected responses
{ uid, username }
 
## /video/add-movie
###### Description
Adds a new film into the database and also inputs that film's genre's into the genre database
###### HTTP Method
/video/add-movie is a POST method
###### Expected input
For input we are expecting the user to fill out the movie's Title, Length, Genre's, description, release date and a thumbnail
###### Expected responses
A confirmation screen that the film has successfully been added
 
## /video/filter-genre
###### Description
Lets the user search films filtered by genres
###### HTTP Method
/video/filter-genre is a POST method
###### Expected input
For input we are expecting the user to select desired genres
###### Expected responses
[MetaData]
 
## /video/filter-views
###### Description
Lets the user search films by desired amount of views
###### HTTP Method
/video/filter-views is a GET method
###### Expected input
For input we are expecting the user to input a number of views, and then select if they want to search for films that have a lower viewcount or higher viewcount than what they input earlier for number of views
###### Expected responses
[MetaData]
 
## /video/filter-likes
###### Description
Lets the user search films by desired amount of likes
###### HTTP Method
/video/filterLikes is a GET method
###### Expected input
For input we are expecting the user to input a number of likes, and then select if they want to search for films that have a lower like count or higher like count than what they input earlier for number of likes
###### Expected responses
[MetaData]
 
## /video/search
###### Description
Lets user search films by title and genre or just search by title across all genres
###### HTTP Method
/video/search is a GET method
###### Expected input
 Query Param: keyword
###### Expected responses
[MetaData]
 
## /video/top-videos
###### Description
An algorithm? Basically used on the front page to show videos with most views
###### HTTP Method
/video/top-videos is a GET method
###### Expected input
For input we are expecting a number that represents how many videos to show in top videos
###### Expected responses
[MetaData]
 
## /video/count-view
###### Description
Increments the viewcount of the video when it is viewed
###### HTTP Method
/video/count-view is a POST method
###### Expected input
{ vid, uid }
###### Expected responses
There should be no output
 
## /video/metadata
###### Description
Returns the metadata of a video such as vid, title, length, etc.
###### HTTP Method
/video/metadata is a POST method
###### Expected input
For input we are expecting the id of the video
###### Expected responses
Information about the film will be returned such as vid, title, length, etc. Or an error screen will pop up to indicate that the specified vid was not able to find a video
 
## /video/update-likes
###### Description
Updates the amount of likes a video has
###### HTTP Method
/video/update-likes is a POST method
###### Expected input
{ vid, uid }
###### Expected responses
{ views } 
 
## /video/update-dislikes
###### Description
Updates the amount of dislikes a video has
###### HTTP Method
/video/update-dislikes is a POST method
###### Expected input
{ vid, uid }
###### Expected responses
{ views } 
 
## /video/comment
###### Description
Adds a comment to the video
###### HTTP Method
/video/comment is a POST method
###### Expected input
For input we are expecting the comment itself and the video's vid and the user's uid and username
###### Expected responses
none
 
## /video/get-comments
###### Description
Returns the comments that a video has
###### HTTP Method
/video/get-comments is a POST method
###### Expected input
For input we are expecting the vid of the video
###### Expected responses
We should see all the comments that the video associated to the vid has
 
## /video/update-comment-likes
###### Description
Updates the amount of likes a comment has
###### HTTP Method
/video/update-comment-likes is a POST method
###### Expected input
{ cid, uid, increment }
###### Expected responses
none
 
## /video/update-comment-dislikes
###### Description
Updates the amount of dislikes a comment has
###### HTTP Method
/video/update-comment-dislikes is a POST method
###### Expected input
{ cid, uid, increment }
###### Expected responses
none
 
## /video/get-comment-likes-dislikes
###### Description
Returns how many likes or dislikes a comment currently has
###### HTTP Method
/video/get-comment-likes-dislikes is a POST method
###### Expected input
{ vid, uid }
###### Expected responses
{ cid, liked, disliked }
