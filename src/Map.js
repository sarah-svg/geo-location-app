import React, { useState, useCallback, useRef } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { formatRelative } from 'date-fns';
import '@reach/combobox/styles.css';
import style from './style.js';
import './styles.css';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';


import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

export default function Map() {
  const [marker, setMarker] = useState([]);
  const [selected, setSelected] = useState(null);
 ///maker state
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
  const center = {
    lat: 45.6769958,
    lng: -122.5323894
  };
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
        {/* this is the marker component which takes in the marker 
        state and maps through each mark and renders then on the page by access the single instance
        and dot notating to grab the values we need then sets the selected value to state*/}
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

function LocateUserAndRenderLocation({ panTo }) {
  ///// takes in a callback prop of panTo. Gets the geolocation of that user and then uses the callback
  //// to get the current location of the user and then renders the location on the map
  return (

    <div>
      <button className='locate-user' onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('got location validation', position);
          panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });

        }, () => null);
      }}>
        <span role='img' aria-label='world'>🧭</span>
        Click me to find your location
      </button>
    </div>
  );
}






function Search({ panTo }) {
  //// this is the search component that takes in a callback prop of panTo.
  ///// this is a callback function that takes in the value of the input and then uses the callback to render the users
  //// searched location on the map else a alert that will pop up if the users location is not found
  /// usePlacesAutocomplete is a function that takes in 4 parameters of ready, value, suggestions which is a object and to functions
  /// a setValue function and clearSuggestions function.
  const { ready, value, suggestions:{ status, data }, setValue, clearSuggestion } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.6769958, lng: () => -122.5323894 },
      radius: 200 * 1000,
    }
  });

  return (
    <div className='search'>
      {/* give it a className to style and see it on the screen */}
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          // clearSuggestion(...suggestions);
          try {
            // grab results the getGeocode function set that to a variable called results then
            // the feed the first result into the getLatLng function set that to a variable which we
            /// destructure the lat and lng from that function call and then pass lat and lng into the panTo function
            /// which will pan the map to the location of the user
            const results = await getGeocode({ address });
            console.log(results, 'getGeocodes');
            const { lat, lng } = await getLatLng(results[0]);
            // destructor lat and lng with this built in function
            console.log(lat, lng, 'getLatLng ||||||');
            panTo(lat, lng);
          } catch {
            //// if it cant find the location it will alert the user that it cant find the location
            alert('Something went wrong');
          }
          console.log(location, 'location validation');
        }}
      >
        <ComboboxInput value={value}
          // {/* this is the input that the user will type in to search for a location  we will grab the event on this input
          // then grab the value by dot noting into the event called e for short*/}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder='Search Places you want to go'
        />

        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
           
            data.map(({ id, description, i }) => (
              <ComboboxOption key={Math.random() * Number(id) + i } value={description} />
              
            ))}
          </ComboboxList>
        </ComboboxPopover>

      </Combobox>
    </div>
  );
}