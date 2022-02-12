import React from 'react';
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

export default function Map() {
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
    disableDefaultUI: true,
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
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
      />





    </div>
  );
}
