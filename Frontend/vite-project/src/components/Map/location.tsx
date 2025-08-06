import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100%' };

const center = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function HotelMap({ lat = center.lat, lng = center.lng }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('🛑 Missing Google Maps API key in .env');
    return <div>Please set your API key in .env</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat, lng }}
        zoom={15}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </LoadScript>
  );
}
