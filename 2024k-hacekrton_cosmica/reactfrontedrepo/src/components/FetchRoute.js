import axios from 'axios';
import {TMAP_API_KEY} from '@env'

export const fetchRoute = async (origin, destination, setLoading, setRouteCoordinates) => {
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms 지연, 네트워크 요청 타이밍 문제 완화를 위해 잠시 지연 코드를 넣었습니다
    setLoading(true);
    try {
        const response = await axios.get('https://apis.openapi.sk.com/tmap/routes/pedestrian', { //보행자 경로
            headers: {
                'appKey': TMAP_API_KEY, // SK Open API 키
            },
            params: {
                startX: origin.longitude, // 출발지 경도
                startY: origin.latitude,  // 출발지 위도
                endX: destination.longitude,   // 도착지 경도
                endY: destination.latitude,    // 도착지 위도
                reqCoordType: 'WGS84GEO',      // 요청 좌표 타입
                resCoordType: 'WGS84GEO',      // 응답 좌표 타입
                startName: '출발지',           // 출발지 이름
                endName: '도착지',             // 도착지 이름
            }
        });
        if (response.data && response.data.features) {
            const coordinates = response.data.features
                .filter(feature => feature.geometry.type === 'LineString')
                .flatMap(feature => feature.geometry.coordinates.map(point => ({
                    latitude: point[1],
                    longitude: point[0]
                })));
            setRouteCoordinates(coordinates);
        } else {
            console.error('No routes found');
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    } finally {
        setLoading(false);
    }
};