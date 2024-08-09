import axios from 'axios';
import {NAVER_CLIENT_ID, NAVER_CLIENT_SECRET} from '@env'

export const fetchRoute = async (origin, destination, setLoading, setRouteCoordinates) => {
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms 지연, 네트워크 요청 타이밍 문제 완화를 위해 잠시 지연 코드를 넣었습니다
    setLoading(true);
    try {
        const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving', {
            headers: {
                'X-NCP-APIGW-API-KEY-ID': NAVER_CLIENT_ID, // 네이버 클라이언트 ID
                'X-NCP-APIGW-API-KEY': NAVER_CLIENT_SECRET// 네이버 클라이언트 시크릿
            },
            params: {
                start: `${origin.longitude},${origin.latitude}`,
                goal: `${destination.longitude},${destination.latitude}`
            }
        });

        if (response.data && response.data.route && response.data.route.traoptimal) {
            const coordinates = response.data.route.traoptimal[0].path.map(point => ({
                latitude: point[1],
                longitude: point[0]
            }));
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