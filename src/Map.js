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

  const panTo = useCallback((lat, lng) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(12);
  }, []);


  const libraries = ['places'];

  const mapContainerStyle = {
    width: '100vh',
    height: '100vh',
  };
  const center = {
    lat: 45.6769958,
    lng: -122.5323894
  };
  const options = {
    styles: style,
    // disableDefaultUI: true,
    zoomControl: true,

  };
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS,
    libraries
  });

  if (loadError) return 'Error loading google maps';
  if (!isLoaded) return 'Loading Maps!!!!!!!!!!';

  // REACT_APP_GOOGLE_MAPS
 

  return (
    <div>
      <h1>My Geolocation App
        <span role='img' aria-label='world'>🗺</span>
      </h1>
      <Search panTo={panTo} />
      <LocateUserAndRenderLocation panTo={panTo} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={clickOnMap}
        onLoad={onLoad}
       
      >
        {marker.map((single, i) => <Marker key={Math.random() + i}
          position={{ lat: single.lat, lng: single.lng }} 
          onClick={() => setSelected(single)}
        />)}
        {selected ? (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lat }}
            onCloseClick={() => setSelected(null)}>
            <div>
              <h2>You clicked here!!</h2>
              <p>Latitude: {selected.lat}</p>
              <p>Longitude: {selected.lng}</p>
              <p>Time: {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function LocateUserAndRenderLocation({ panTo }) {
  return (

    <div>
      <button className='locate-user' onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('got location', position);
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
  const { ready, value, suggestions:{ status, data }, setValue, clearSuggestion } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.6769958, lng: () => -122.5323894 },
      radius: 200 * 1000,
    }
  });

  return (
    <div className='search'>
      <Combobox
        onSelect={async (address) => {
          setValue(address, false);
          // clearSuggestion(...suggestions);
          try {
            const results = await getGeocode({ address });
            console.log(results, 'getGeocodes');
            const { lat, lng } = await getLatLng(results[0]);
            // destructor lat and lng with this built in function
            console.log(lat, lng, 'getLatLng ||||||');
            panTo(lat, lng);
          } catch {
            alert('Something went wrong');
          }
          console.log(location);
        }}
      >
        <ComboboxInput value={value}
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