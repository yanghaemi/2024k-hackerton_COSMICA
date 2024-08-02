import axios from 'axios';
//구글맵 경로 api말고 다른 api 시도 중중

export const fetchRouteWithMapbox = async (origin, destination, setLoading, setRouteCoordinates) => {
    setLoading(true);
    try {
        const response = await axios.get('https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}', {
            params: {
                access_token: 'YOUR_MAPBOX_ACCESS_TOKEN',
                geometries: 'geojson'
            }
        });

        if (response.data.routes && response.data.routes.length > 0) {
            const coordinates = response.data.routes[0].geometry.coordinates;
            setRouteCoordinates(coordinates.map(coord => ({
                latitude: coord[1],
                longitude: coord[0],
            })));
        } else {
            console.error('No routes found');
        }
    } catch (error) {
        console.error('Error fetching route:', error);
    } finally {
        setLoading(false);
    }
};


