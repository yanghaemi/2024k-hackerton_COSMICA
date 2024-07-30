import axios from 'axios';

// 사용자 데이터를 가져오는 함수
const fetchUserData = async () => {
  try {
    const response = await axios.get('http://192.168.1.33:5000/mypage/User');
    return response.data;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    throw error;
  }
};

export default fetchUserData;