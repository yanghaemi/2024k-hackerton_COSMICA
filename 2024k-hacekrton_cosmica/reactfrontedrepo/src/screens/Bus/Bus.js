import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { useEffect, useState } from "react";
import { BUS_INFO_SERVICE, BUS_API_URL, BUS_INFO_F, E_BUS_API_SERVICE_KEY } from '@env';
import {useNavigation} from "@react-navigation/native";

const Bus = ({ route }) => {
    const { item, selectedCityCode } = route.params;
    const [pageNo, setPageNo] = useState(1);
    const [numOfRows, setNumOfRows] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [bus, setBus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBus(pageNo);
    }, [selectedCityCode, item.nodeno, pageNo]);

    const fetchBus = (pageNo) => {
        const url = BUS_API_URL;
        const serviceName = BUS_INFO_SERVICE;
        const functionName = BUS_INFO_F;
        const params = {
            serviceKey: decodeURIComponent(E_BUS_API_SERVICE_KEY),
            numOfRows: numOfRows,
            pageNo: pageNo,
            _type: 'json',
            cityCode: selectedCityCode,
            nodeId: item.nodeid,
        };

        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}${serviceName}/${functionName}?${queryString}`;
        console.log("버스 도착정보 api Full Url=", fullUrl);
        console.log("도시 코드:", params.cityCode);

        setLoading(true);
        fetch(fullUrl)
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(JSON.stringify(data, null, 2));
                const body = data.response.body || {};
                let items = body.items ? body.items.item : [];

                // 도착 예상 시간으로 정렬 (오름차순)
                items = items.sort((a, b) => a.arrtime - b.arrtime);

                // 도착 예상 시간이 30분(1800초) 이하인 항목만 필터링
                items = items.filter(item => item.arrtime <= 1800);

                setBus(prevBus => [...prevBus, ...items]); // Append new items to existing ones
                setTotalCount(body.totalCount || 0);
                setHasMore(items.length > 0 && bus.length < totalCount); // Check if more items are available
                setLoading(false);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                setLoading(false);
            });
    };


    const renderItem = ({ item }) => {
        const isLowFloorBus = item.vehicletp === "저상버스";
        return (
            <TouchableOpacity style={[styles.busItem, isLowFloorBus && styles.lowFloorBusItem]}
                              onPress={()=>navigation.navigate("BusRoute",{item, selectedCityCode})}
            >
                <Text style={styles.busName}>버스 번호: {item.routeno}</Text>
                <Text style={styles.busDetails}>도착까지 남은 정류장: {item.arrprevstationcnt}</Text>
                <Text style={styles.busDetails}>
                    도착 예상 시간: {Math.floor(item.arrtime / 60)}분 {item.arrtime % 60}초
                </Text>
                <Text style={[styles.busDetails, isLowFloorBus && styles.lowFloorBusDetails]}>차량 유형: {item.vehicletp}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <FlatList
            data={bus}
            style={styles.busItems}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>No bus information found</Text>}
            onEndReached={() => {
                if (hasMore && !loading) {
                    setPageNo(prevPageNo => prevPageNo + 1);
                }
            }}
            onEndReachedThreshold={0.5}
        />
    );
};

const styles = StyleSheet.create({
    busItems: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    busItem: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 3,
        marginBottom: 10,
    },
    busName: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    busDetails: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#aaa',
    },
    lowFloorBusItem: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#e0f7fa', // 저상버스일 경우 배경 색을 밝은 파란색으로 설정
        borderColor: '#006064',     // 경계선을 진한 파란색으로 설정
    },
});

export default Bus;
