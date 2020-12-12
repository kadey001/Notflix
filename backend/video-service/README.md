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


## /newfilm
###### Description
Adds a new film into the database and also inputs that film's genre's into the genre database
###### HTTP Method
/newfilm is a POST method
###### Expected input
For input we are expecting the user to fill out the movie's Title, Length, Genre's, description, and release date
###### Expected responses
A confirmation screen that the film has successfully been added

## /filterGenre
###### Description
Lets the user search films filtered by genres
###### HTTP Method
/filterGenre is a GET method
###### Expected input
For input we are expecting the user to select desired genres
###### Expected responses
A list of movies that match the selected genres, or if none, a screen saying no movies matched selected genres

## /filterViews
###### Description
Lets the user search films by desired amount of views
###### HTTP Method
/filterViews is a GET method
###### Expected input
For input we are expecting the user to input a number of views, and then select if they want to search for films that have a lower viewcount or higher viewcount than what they input earlier for number of views
###### Expected responses
A list of movies that have a lower viewcount or higher viewcount than what was specified, if no movies match the criteria, a screen saying no movies match their desired viewcount is shown

## /filterLikes
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

## /topVideos
###### Description
An algorithm? Basically used on the front page to show videos with most views
###### HTTP Method
/topVideos is a POST method
###### Expected input
For input we are expecting a number that represents how many videos to show in top videos
###### Expected responses
A list of films with the highest views

## /watchVid
###### Description
Increments the viewcount of the video when it is viewed
###### HTTP Method
/watchVid is a POST method
###### Expected input
For input we are expecting the id of the video
###### Expected responses
There should be no output