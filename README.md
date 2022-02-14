# React Map!
- I used React and Hooks with functional Components. With functional components you are
able. to pass state and props more consistently. Since I also used functional hooks
I am able to utilize Reacts built in hooks feature to set my state, on load my page renders
with the users current location, useCallbacks and useRefs to prevent to many reloads

#### This application utilizes the @react-google-map-api to load a map and also allows this user to search places using there places libraries

#### I also utilize the Marker and InfoWindow function available along with a Seach and Button which will jump the map to the user's location
    1. On Load it will render a Marker on the users current location
    2. Allows users to add makers which then a info window opens up that displays
       the date and the markers latitude and longitude 
    3. Uses the use-places-autocomplete packages along with combobox which is similar to a form
        inside that we have our input and a list of possible addresses.
    4.  Creates a button to make the map render on the users current location.
###### What I could add in the future! 
 - Create a database either sql or supabase.
    * For `Sql`
        - I would need a table with the rows of location/coordinates, 
            one maybe for description, image, one for maker. That way
            the user can save a particular location with note or whatever else.
        - A user name, email, password
        - So then only one user is able to view there save markers no anyone else
    * For `Supabase`
    - I would need a table with the rows of location/coordinates, 
            one maybe for description, image, one for maker and a user_id. That way
            the user can save a particular location with note or whatever else.
    - I would use that user_id to access supabase user's table and do it that way.
- With a database/backend the data would be persistent so a user could make a profile
save there favorite locations a description and also the exact location.
