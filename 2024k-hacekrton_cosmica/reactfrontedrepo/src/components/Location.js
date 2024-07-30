import Geolocation from '@react-native-community/geolocation';
import requestLocationPermission from './Permission';

export const getLocation = async (setLocation, setRegion, setLoading, destination) => {
  const hasPermission = await requestLocationPermission(); // 위치 권한 확인

  if (!hasPermission) { // 권한이 없을 경우
    setLoading(false);
    return;
  }

  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // 현재 위도와 경도를 가져옴
      setLocation({ latitude, longitude }); // 위치 상태 업데이트
      if (destination) {
        // 도착지 위치를 지도 중심으로 설정
        setRegion({
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })
      }
      else{
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
      setLoading(false);
    },
    (error) => {
      console.log(error);
      setLoading(false);
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
};
