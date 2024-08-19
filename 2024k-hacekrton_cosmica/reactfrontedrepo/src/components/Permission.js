import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') { // Android 플랫폼인 경우
        try {
            const hasLocationPermission = await PermissionsAndroid.check( // 권한 있는지 확인
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            if (!hasLocationPermission) { // 위치 권한이 없을 시
                const status = await PermissionsAndroid.request( // 권한 요구
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: '위치 권한 요청',
                        message: '앱에서 현재 위치를 사용하려고 합니다.',
                        buttonNeutral: '나중에',
                        buttonNegative: '취소',
                        buttonPositive: '확인',
                    }
                );

                if (status !== PermissionsAndroid.RESULTS.GRANTED) { // 권한이 거부된 경우
                    console.log('Location permission denied');
                    return false;
                }
            }
        } catch (err) {
            console.warn('Permission request error:', err);
            return false;
        }
    }
    return true; // 권한이 있는 경우
};

export default requestLocationPermission;
