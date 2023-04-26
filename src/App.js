import MapContainer from './map';
import { useLoadScript} from '@react-google-maps/api';

export default function App() {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey : process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
        libraries : ['places'],
    });

    if (!isLoaded) 
        return <div>Loading</div>;

    return (
        <MapContainer />
    );
}