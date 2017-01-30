The Busting Project
===================


**Brief Description:** The aim of this project is to provide the user with a list of available toilets around them. 

**More Elaborate Description: **
1) User provides GPS co-ordinates to the application.
2) Application sends GPS data to the backend.
3) Backend queries the database for top 5 toilet locations closest to the user's GPS coordinates.
4) Backend returns JSON data to the user, and displays it to the user.

**Planned Future Additions: **
1) User submissions - The user would be able to submit a toilet location ; after the location is verified by (more than 3 users?) it gets added to the list.
2) Toilet ratings (star rating?)


----------


TODO
-------------

1) Download toilet dataset - https://data.gov.au/dataset/national-public-toilet-map
2) Find invalid records from the dataset, either repair those records or discard. 
3) Plan records that will be necessary for this project. (male/female/lat/long/address/etc)
4) convert dataset to mongoDB database
5) implement REST API to create a basic request/response service
read: http://adrianmejia.com/blog/2014/10/01/creating-a-restful-api-tutorial-with-nodejs-and-mongodb/
read: http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/
6) implement haversine geo-location 
read: http://blog.falafel.com/finding-closest-location-by-latitude-and-longitude/
read: http://opengeocode.org/tutorials/googlemap/googlemaps_7.php
7) Make web-app front end
8) Make android/iOS front-end.