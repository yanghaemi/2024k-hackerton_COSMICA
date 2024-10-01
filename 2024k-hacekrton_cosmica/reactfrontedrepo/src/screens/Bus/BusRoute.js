import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { useRoute } from '@react-navigation/native';
import {BUS_ROUTE_SERVICE, BUS_API_URL, BUS_ROUTE_INFO_F, E_BUS_API_SERVICE_KEY2} from '@env';

const BusRoute = () => {
    const route = useRoute();
    const { item, selectedCityCode } = route.params;
    const [pageNo, setPageNo] = useState(1); // 페이지 번호 초기값 1로 설정
    const [loading, setLoading] = useState(false);
    const [busRoutes, setBusRoutes] = useState([]);

    useEffect(() => {
        fetchBusRoute(pageNo); // pageNo 값을 전달
        console.log(BUS_ROUTE_SERVICE)
        console.log(BUS_ROUTE_INFO_F)
    }, [selectedCityCode, item.routeid, pageNo]); // pageNo를 의존성 배열에 추가

    const fetchBusRoute = (pageNo) => {
        const url = BUS_API_URL;
        const serviceName = BUS_ROUTE_SERVICE;
        const functionName = BUS_ROUTE_INFO_F;
        const params = {
            serviceKey: decodeURIComponent(E_BUS_API_SERVICE_KEY2),
            _type: 'json',
            numOfRows: 200,
            pageNo: pageNo,
            cityCode: selectedCityCode,
            routeId: item.routeid,
        };

        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}${serviceName}/${functionName}?${queryString}`;
        console.log("버스 노선 정보 api Full Url=", fullUrl);
        console.log("도시 코드:", params.cityCode);

        setLoading(true);
        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('BusRoute 네트워크 이상 ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const body = data.response.body || {};
                const items = body.items ? body.items.item : [];
                setBusRoutes(items);
                console.log(items)
                setLoading(false);
            })
            .catch(error => {
                console.error('BusRoute 에러 발생', error);
                setLoading(false);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>버스 번호: {item.routeno}</Text>
            <Text>{busRoutes[0]?.nodenm} - {busRoutes[busRoutes.length-1]?.nodenm}</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : busRoutes.length > 0 ? (
                <ScrollView style={styles.scrollView}>
                    {busRoutes.map((busRoute, index) => (
                        <View key={index} style={[styles.routeContainer,busRoute.nodenm===item.nodenm && styles.routeContainerHighlight]}>
                            <Text style={styles.routeText}>{index+1}. {busRoute.nodenm} ({busRoute.nodeno})</Text>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.noDataText}>버스 노선 정보를 불러오는 중입니다...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor:'white'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle:{
        fontSize: 20,
    },
    scrollView: {
        width: '100%',
    },
    routeContainer: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#d0d0d0',
        borderStyle: 'solid',
        borderWidth: 1
    },
    routeText: {
        fontSize: 20,
        fontWeight:'bold',
        color: '#333',
    },
    routeContainerHighlight: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#00FFFF',
        borderRadius: 10,
        borderColor: '#f0f0f0',
        borderStyle: 'solid',
        borderWidth: 1
    },
    noDataText: {
        fontSize: 16,
        color: 'gray',
    },
});

export default BusRoute;
