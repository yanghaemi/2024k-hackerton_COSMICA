
import {PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') { // Android 플랫폼인 경우
      const hasLocationPermission = await PermissionsAndroid.check( //권한 있는지 확인
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
  
      if (!hasLocationPermission) { // 위치 권한이 없을 시
        const status = await PermissionsAndroid.request( //권한 요구
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
  
        if (status !== PermissionsAndroid.RESULTS.GRANTED) { // 권한이 거부된 경우
          console.log('Location permission denied');
          return false;
        }
      }
    } 
    return true; // 권한이 있는 경우
  };

  export default requestLocationPermission;