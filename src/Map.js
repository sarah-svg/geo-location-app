/* eslint-disable no-console */
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

import { formatRelative } from 'date-fns';

import '@reach/combobox/styles.css';

import style from './style.js';

import Search from './Search.jsx';

import LocateUserAndRenderLocation from './LocateUserAndRenderLocation.jsx';

import './styles.css';

export default function Map() {
   ///maker state and setter
  const [marker, setMarker] = useState([]);
  ////and setter for the info window
  const [selected, setSelected] = useState(null);
  /// create state for the users current location and set it to null
  /// then in the current I will set it to the users location to state
  //// inside of the useEffect hook I set navigator.geolocation.getCurrentPosition(current); current users coordinates
  const [center, setCurrentPos] = useState(null);
 /// create state for marker of users current location

  const clickOnMap = useCallback((e) => {
    /////setting marker state and previous marker state by spreading
    setMarker((current) => [
      ...current, {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []
  );
  const mapRef = useRef();
  ////maintain state to not cause re-render
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);
  /// on Load we want to set the map to the current map we use a useRef to set the map to the current map inside of a 
  /// useCallback function that takes in the map and then we set the map to the current map
 
  /// this function is also a callback  which takes in the users lat and lng and then it will render that map 
  /// to those locations specified by the user we use this function in the search and locateUserAndRenderLocation components
  const panTo = useCallback((lat, lng) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
  }, []);

  /// we add these to variable to stop re-render
  const libraries = ['places'];
  /// set map container and 100vw/vh width and height
  const mapContainerStyle = {
    width: '100vh',
    height: '100vh',
  };
  /// this will load the google map initially in  Northwest US.
  const current = position => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    if (!position) {
      setCurrentPos({ lat: 45.5231, lng: -122.6765 });
    }
    setCurrentPos(currentPosition);
    // lat: 45.6769958,

    // lng: -122.5323894
  };

//   if (!current) return navigator.geolocation.getCurrentPosition({ lat: 45.5231, lng: -122.6765 });
  useEffect(() => {
    current ? current : navigator.geolocation.getCurrentPosition(current);
    // navigator.geolocation.getCurrentPosition(current);
  }, []);
//  console.log(newPosition);

  //// this is my map style options from https://snazzymaps.com/style/1243/xxxxxxxxxxx which is a
  //// json file that I import as a default file to style the map how my client wants it.
  const options = {
    styles: style,
    // disableDefaultUI: true,
    zoomControl: true,

  };
  ///this is the google map api load script it sets my api key and the libraries so we are able to access places and maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS,
    //// so we can use maps and the places library
    libraries
  });
  /// this checks if the api is not loaded and if it is not loaded it will display an error message
  ///  if it is loaded it will render the map
  /// also if there is a load error it will display an error message
  if (loadError) return 'Error loading google maps';
  if (!isLoaded) return 'Loading Maps!!!!!!!!!!';

  // REACT_APP_GOOGLE_MAPS
  if (!center) return <div>Loading</div>;

  return (
    <div>
      <h1>My Geolocation App
        <span role='img' aria-label='world'>🗺</span>
      </h1>
      {/* this component is a input that search and then will render the user on the screen  using
      my panTo function which is a callback function to stop all of the re-renders*/}
      <Search panTo={panTo} />
      {/* this component  */}
      <LocateUserAndRenderLocation panTo={panTo} />
      <GoogleMap
        //  this is the google map component which takes in a few parameters in this case I set them 
        // to variables then used those variable in the components when we do it this we we stop the page from
        // re-rendering to many times 
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={clickOnMap}
        onLoad={onLoad}
       
      >
        {/* this is the marker component which takes in the center
        state checks if there is a latitude/longitude and then it will render 
        the marker on the current location*/}
        center.lat || center.lng && (
        <Marker position={center} />
        )
        {/* this is the marker component which takes in the marker 
        state and maps through each mark and renders then on the page by access the single instance
        and dot notating to grab the values we need then sets the selected value to state
        and then renders the marker on the page */}
        {marker.map((single, i) => <Marker key={Math.random() + i}
          position={{ lat: single.lat, lng: single.lng }} 
          onClick={() => setSelected(single)}
        />)}
        {/* checks if there is a select and if so the info window component which shows a pop up box which renders
         certain locations else renders null*/}
        {selected ? (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lat }}
            onCloseClick={() => setSelected(null)}>
            <div>
              <h2>You clicked here!!</h2>
              <p>Latitude: {selected.lat}</p>
              <p>Longitude: {selected.lng}</p>
              {/*  uses a function to display the time to make it more readable to users takes in two times and returns a string */}
              <p>Time: {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
    
      </GoogleMap>
    </div>
  );
}




