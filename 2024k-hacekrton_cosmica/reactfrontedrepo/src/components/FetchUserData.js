import axios from 'axios';
import {REACT_APP_NODEJS_API_URL, REACT_APP_LOCAL_API_URL} from '@env'

// 사용자 데이터를 가져오는 함수
//서버 확인용 코드입니다
const fetchUserData = async () => {
  try {
    const response = await axios.get(`${REACT_APP_LOCAL_API_URL}/mypage/User`); //정보 받아오기
    return response.data;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생: ', error);
    throw error;
  }
};

export default fetchUserData;