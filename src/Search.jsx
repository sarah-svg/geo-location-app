import React from 'react';
import {
  usePlacesAutocomplete,
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
  
const Search = () => {
  const {ready, } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.6769958, lng: () => -122.5323894 },
      radius: 200 * 1000,
    }
  });
  return (
    <div>
    </div>
  );
};

export default Search;