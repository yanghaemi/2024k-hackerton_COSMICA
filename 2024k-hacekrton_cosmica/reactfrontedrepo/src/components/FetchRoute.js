import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

export const fetchRoute = async (origin, destination, setLoading, setRouteCoordinates) => {
    setLoading(true); // 로딩 상태 시작
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: `${origin.latitude},${origin.longitude}`, //출발지 위치
                destination: `${destination.latitude},${destination.longitude}`, //도착지 위치
                key: GOOGLE_MAPS_API_KEY, //구글 API 키
            },
        });
        console.log('API response:', response.data);
        if (response.data.status === 'OK') {
            if (response.data.routes.length > 0) {
                const points = response.data.routes[0].overview_polyline.points;
                const decodedPoints = decodePolyline(points);
                setRouteCoordinates(decodedPoints); // 경로 표시
            } else {
                console.error('No routes found');
            }
        } else {
            console.error(`Error fetching directions: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    } finally {
        setLoading(false); // 로딩 상태 종료
    }
};

const decodePolyline = (encoded) => { //디코딩
  let points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);
      let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += dlat;
      shift = 0;
      result = 0;
      do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
      } while (b >= 0x20);
      let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += dlng;
      points.push({
          latitude: lat / 1e5,
          longitude: lng / 1e5
      });
  }
  return points;
};
