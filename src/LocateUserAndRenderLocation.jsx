/* eslint-disable no-console */
export default function LocateUserAndRenderLocation({ panTo }) {
    ///// takes in a callback prop of panTo. Gets the geolocation of that user and then uses the callback
    //// to get the current location of the user and then renders the location on the map
  return (
    <div className='locate-user'>
      <button onClick={() => {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('got location validation', position);
          panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
  
        }, () => null);
      }}>
        <span role='img' aria-label='world'>🧭</span>
          Click me to find your location
      </button>
    </div>
  );
}