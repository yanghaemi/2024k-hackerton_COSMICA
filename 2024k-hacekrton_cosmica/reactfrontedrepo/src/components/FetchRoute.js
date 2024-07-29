import { GOOGLE_MAPS_API_KEY } from '@env';
import axios from 'axios';

export const fetchRoute = async (origin, destination, setLoading, setRouteCoordinates) => {
    setLoading(true); // 로딩 상태 시작
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: `${origin.latitude},${origin.longitude}`,
                destination: `${destination.latitude},${destination.longitude}`,
                key: GOOGLE_MAPS_API_KEY,
            },
        });

        if (response.data.status === 'OK') {
            const points = response.data.routes[0].overview_polyline.points;
            const decodedPoints = decodePolyline(points);
            setRouteCoordinates(decodedPoints);
        } else {
            console.error(`Error fetching directions: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    } finally {
        setLoading(false); // 로딩 상태 종료
    }
};

  const decodePolyline = (t) => {
    let output = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      output.push({
        latitude: (lat / 1E5),
        longitude: (lng / 1E5),
      });
    }

    return output;
  };