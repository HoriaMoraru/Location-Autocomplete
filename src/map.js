import { GoogleMap, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function MapContainer() {
  const [center, setCenter] = useState({ lat: null, lng: null });
  const [selected, setSelected] = useState(null);
  const [markerLocation, setMarkerLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCenter({ lat: latitude, lng: longitude });
      setMarkerLocation({ lat: latitude, lng: longitude });
    });
  }, []);

  const handleMarkerClick = (e) => {
    const { latLng } = e;
    setMarkerLocation({ lat: latLng.lat(), lng: latLng.lng() });
  };

  return (
    <div>
      <div className="search-container">
        <SearchBox setSelected={setSelected} />
      </div>
      <GoogleMap
        zoom={18}
        center={selected || center}
        mapContainerClassName="map-container"
        onClick={handleMarkerClick}
      >
        {markerLocation && <Marker position={markerLocation} />}
        {selected && <Marker position={selected} onClick={handleMarkerClick} />}
      </GoogleMap>
    </div>
  );
}

const SearchBox = ({ setSelected }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = getLatLng(results[0]);
      setSelected({ lat: lat, lng: lng });
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Enter an address"
      />

      {status === "OK" && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.map((suggestion) => {
            const {
              id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;
            return (
              <li
                key={id}
                onClick={() =>
                  handleSelect(suggestion.structured_formatting.main_text)
                }
              >
                <strong>{main_text}</strong> <small>{secondary_text}</small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
