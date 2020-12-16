# Video Service

A microservice for video streaming

What endpoint it is (what /name)
Description of what it does
What HTTP Method it is (GET, POST, ...)
What request key,value / body is expected
Expected responses

## /name
###### Description
###### HTTP Method
###### Expected input
###### Expected responses

## /newPerson
###### Description
Adds a new user to the database, and also adds their id and plan to the plan database
###### HTTP Method
/newPerson is a POST method
###### Expected input
For input we are expecting the user to fill out their name, email, password, and desired plan
###### Expected responses
A confirmation screen that the user has successfully been created

## /updatePlan
###### Description
Changes the users current plan to a different one
###### HTTP Method
/updatePlan is a POST method
###### Expected input
For input we are expecting the user to fill out their new plan and their uid and new plan will be automatically passed through the query
###### Expected responses
A confirmation screen that the user has successfully changed their plan


## /add-movie
###### Description
Adds a new film into the database and also inputs that film's genre's into the genre database
###### HTTP Method
/add-movie is a POST method
###### Expected input
For input we are expecting the user to fill out the movie's Title, Length, Genre's, description, release date and a thumbnail
###### Expected responses
A confirmation screen that the film has successfully been added

## /filter-genre
###### Description
Lets the user search films filtered by genres
###### HTTP Method
/filter-genre is a POST method
###### Expected input
For input we are expecting the user to select desired genres
###### Expected responses
A list of movies that match the selected genres, or if none, a screen saying no movies matched selected genres

## /filter-views
###### Description
Lets the user search films by desired amount of views
###### HTTP Method
/filter-views is a GET method
###### Expected input
For input we are expecting the user to input a number of views, and then select if they want to search for films that have a lower viewcount or higher viewcount than what they input earlier for number of views
###### Expected responses
A list of movies that have a lower viewcount or higher viewcount than what was specified, if no movies match the criteria, a screen saying no movies match their desired viewcount is shown

## /filter-likes
###### Description
Lets the user search films by desired amount of likes
###### HTTP Method
/filterLikes is a GET method
###### Expected input
For input we are expecting the user to input a number of likes, and then select if they want to search for films that have a lower like count or higher like count than what they input earlier for number of likes
###### Expected responses
A list of movies that have a lower like count or higher like count than what was specified, if no movies match the criteria, a screen saying no movies match their desired like count is shown

## /search
###### Description
Lets user search films by title and genre or just search by title across all genres
###### HTTP Method
/search is a GET method
###### Expected input
For input we are expecting the user to input a film title and specify the genres they want to search in, or just the film title
###### Expected responses
A film or list of films that match the title and specified genres

## /top-videos
###### Description
An algorithm? Basically used on the front page to show videos with most views
###### HTTP Method
/top-videos is a GET method
###### Expected input
For input we are expecting a number that represents how many videos to show in top videos
###### Expected responses
A list of films with the highest views

## /count-view
###### Description
Increments the viewcount of the video when it is viewed
###### HTTP Method
/watchVid is a POST method
###### Expected input
For input we are expecting the id of the video
###### Expected responses
There should be no output

## /metadata
###### Description
Returns the metadata of a video such as vid, title, length, etc.
###### HTTP Method
/metadata is a POST method
###### Expected input
For input we are expecting the id of the video
###### Expected responses
Information about the film will be returned such as vid, title, length, etc. Or an error screen will pop up to indicate that the specified vid was not able to find a video

## /update-likes
###### Description
Updates the amount of likes a video has
###### HTTP Method
/update-likes is a POST method
###### Expected input
For input we are expecting the id of the video and a boolean representing if the user liked the video already or not
###### Expected responses
The amount of likes should update and reflect how many likes it currently has

## /update-dislikes
###### Description
Updates the amount of dislikes a video has
###### HTTP Method
/update-dislikes is a POST method
###### Expected input
For input we are expecting the id of the video and a boolean representing if the user disliked the video already or not
###### Expected responses
The amount of likes should update and reflect how many dislikes it currently has

## /comment
###### Description
Adds a comment to the video
###### HTTP Method
/comment is a POST method
###### Expected input
For input we are expecting the comment itself and the video's vid and the user's uid and username
###### Expected responses
The comment should appear on the appropriate video along with the username of who posted it

## /get-comments
###### Description
Returns the comments that a video has
###### HTTP Method
/get-comments is a POST method
###### Expected input
For input we are expecting the vid of the video
###### Expected responses
We should see all the comments that the video associated to the vid has

## /update-comment-likes
###### Description
Updates the amount of likes a comment has
###### HTTP Method
/update-comment-likes is a POST method
###### Expected input
For input we are expecting the id of the comment the user's id and a boolean representing if the user has liked the comment or not before
###### Expected responses
The amount of likes on the comment should be updated and appropriately reflected in the comments like count

## /update-comment-dislikes
###### Description
Updates the amount of dislikes a comment has
###### HTTP Method
/update-comment-dislikes is a POST method
###### Expected input
For input we are expecting the id of the comment the user's id and a boolean representing if the user has dislikes the comment or not before
###### Expected responses
The amount of dislikes on the comment should be updated and appropriately reflected in the comments like count

## /get-comment-likes-dislikes
###### Description
Returns how many likes or dislikes a comment currently has
###### HTTP Method
/get-comment-likes-dislikes is a POST method
###### Expected input
For input we are expecting the id of the video and id of the user
###### Expected responses
The amount of likes and dislikes should be returned