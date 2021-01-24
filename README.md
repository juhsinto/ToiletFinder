# Toilet Finder (AU)

**Brief Description:** The aim of this project is to provide the user with a list of available toilets around them.

![Alt Text](demo/video_output.gif)

**More Elaborate Description: **

1. User provides GPS co-ordinates to the application (via browser).
2. Web Application (built in React.js) sends GPS data to the backend. (uses the backend microservice https://github.com/juhsinto/AUPubToiletServer)
3. Backend queries the database for top 3 toilet locations closest to the user's GPS coordinates.
4. Backend returns JSON data to the user, and displays it to the user on the Map (Leaflet)

**Planned Future Additions: **

1. User submissions - The user would be able to submit a toilet location ; after the location is verified by (more than 3 users?) it gets added to the list.
2. Toilet ratings (star rating?)
