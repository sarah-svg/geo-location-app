/// import the libraries we need
/* eslint-disable no-console */
import '@reach/combobox/styles.css';
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


export default function Search({ panTo }) {
    //// this is the search component that takes in a callback prop of panTo.
    ///// this is a callback function that takes in the value of the input and then uses the callback to render the users
    //// searched location on the map else a alert that will pop up if the users location is not found
    /// usePlacesAutocomplete is a function that takes in 4 parameters of ready, value, suggestions which is a object and to functions
    /// a setValue function and clearSuggestions function.
  const { ready, value, suggestions:{ status, data }, setValue } = usePlacesAutocomplete({
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
            console.log(results, 'getGeocode');
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