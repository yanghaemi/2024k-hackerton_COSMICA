import { FlatList, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { BUS_INFO_SERVICE, BUS_API_URL, BUS_INFO_F, E_BUS_API_SERVICE_KEY } from '@env';

const Bus = ({ route }) => {
    const { item, selectedCityCode } = route.params;
    const [pageNo, setPageNo] = useState(1);
    const [numOfRows, setNumOfRows] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [bus, setBus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

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
            nodeId: item.nodeno,
        };

        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}${serviceName}/${functionName}?${queryString}`;
        console.log("버스 도착정보 api Full Url=", fullUrl);
        console.log("도시 코드:", params.cityCode);

        setLoading(true);
        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log(JSON.stringify(data, null, 2));
                const body = data.response.body || {};
                const items = body.items ? body.items.item : [];
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
            <View style={[styles.busItem, isLowFloorBus && styles.lowFloorBusItem]}>
                <Text style={styles.busName}>버스 번호: {item.routeno}</Text>
                <Text style={styles.busDetails}>도착까지 남은 정류장: {item.arrprevstationcnt}</Text>
                <Text style={styles.busDetails}>
                    도착 예상 시간: {Math.floor(item.arrtime / 60)}분 {item.arrtime % 60}초
                </Text>
                <Text style={[styles.busDetails, isLowFloorBus && styles.lowFloorBusDetails]}>차량 유형: {item.vehicletp}</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={bus}
            keyExtractor={item => item.routeid} // 고유한 ID를 사용하여 keyExtractor 설정
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
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    busDetails: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#aaa',
    },
});

export default Bus;
