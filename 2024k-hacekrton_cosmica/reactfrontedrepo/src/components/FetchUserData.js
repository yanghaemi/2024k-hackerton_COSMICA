import axios from 'axios';
import {REACT_APP_NODEJS_API_URL, REACT_APP_LOCAL_API_URL} from '@env'

// 사용자 데이터를 가져오는 함수
//서버 확인용 코드입니다
export const fetchUserData = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms 지연, 네트워크 요청 타이밍 문제 완화를 위해 잠시 지연 코드를 넣었습니다
    const response = await axios.get(`${REACT_APP_LOCAL_API_URL}/mypage/User`); //정보 받아오기
    return response.data;
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생: ', error);
    throw error;
  }
};

