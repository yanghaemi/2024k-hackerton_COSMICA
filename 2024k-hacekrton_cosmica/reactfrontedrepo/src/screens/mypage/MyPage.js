import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import fetchUserData from '../../components/FetchUserData'


const MyPage= () =>{
    const[userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserData = async () => { //유저 데이터 가져오는 함수
            try {
              const data = await fetchUserData(); //유저 데이터 가져오기
              setUserData(data); // 데이터를 상태에 저장
            } catch (err) {
              console.error('데이터를 가져오는 중 오류가 발생:', err);
              setError(err);
            } finally {
              setLoading(false);
            }
          };
      
          loadUserData();
      }, []);


  if (loading) {
    return <Text>로딩 중</Text>;
  }

  if (error) {
    return <Text>오류가 발생: {error.message}</Text>;
  }

  if (!userData) {
    return <Text>데이터가 없습니다.</Text>;
  }
  
    return (
      <SafeAreaView style={{ flex: 1 }}> 
      <View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.description}>{userData.role}{'\n'}{userData.rank}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
    )
  }

  const styles = StyleSheet.create({ //style 참고용
    userName: {
      fontSize: 40,
      fontWeight: '600',
      color: 'black'
    },
    description: {
      marginTop: 8,
      fontSize: 25,
      color: 'black',
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });

  export default MyPage;