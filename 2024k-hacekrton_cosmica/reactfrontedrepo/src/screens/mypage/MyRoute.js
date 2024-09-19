
import { StyleSheet, View, ActivityIndicator, Text, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import Login from "../../loginregister/Login";
import Register from "../../loginregister/Register"; 
import axios from 'axios';
const Stack = createStackNavigator();



function MyRoute({apiUrl}) {

  const [routes, setRoutes] = useState([]); // 검색 후 동일 출발, 목적지 경로 추천

    useEffect(() => {
        console.log(apiUrl)
        getRoutes();
    },[])

    const getRoutes = async () => {
  try {
    const response = await axios.get(`${apiUrl}/main/getMyRouter`
        );

          if (response.data) {
            setRoutes(response.data.data);
            console.log("??",response.data.data)
          }
        } catch (error) {
          console.error("에러?:", error);
    }
  }

    const renderItem = ({ item }) => (
  // 터치하면 해당 경로 띄우기
  <TouchableOpacity onPress={() => handleRoutePress(item)} style={styles.touchable}>
     <View style={styles.itemContainer}>
       <Text style={styles.title}>경로 ID: {item.routeId}</Text>
       <Text>출발지: {item.origin.name}</Text>
       <Text>목적지: {item.destination.name}</Text>
       <Text>작성자: cosmica</Text>
    </View>
  </TouchableOpacity>
  );
    return (
        <View style={styles.routeList}>
        <Text style={styles.listTitle}>📍 내가 저장한 경로 📍</Text>
            <FlatList
          data={routes}
          renderItem={renderItem}
          // keyExtractor={(item) => item..toString()}
        />
        </View>
    );

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
     routeList: {
      position: 'flex',
      backgroundColor: 'white',
     // marginBottom: 5,
     height: 500,
      padding:10,
      borderRadius: 5,
    
    },
      listTitle: {
 fontWeight: 'bold',
    fontSize: 24, // 타이틀이 좀 더 눈에 띄게
    textAlign: 'center', // 텍스트를 중앙에 배치
    color: '#333', // 텍스트 색상
    marginVertical: 10, // 위아래 여백
    },
      itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // 안드로이드에서 그림자 표시
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default MyRoute;