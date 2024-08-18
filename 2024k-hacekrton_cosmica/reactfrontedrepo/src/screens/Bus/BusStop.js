import React, { useState, useEffect } from 'react';
import {View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator} from 'react-native';
import { BUS_API_URL, E_BUS_API_SERVICE_KEY, BUS_INFO_SERVICE, CITY_INFO_F, BUS_STOP_SERVICE, NAME_TO_CODE_F } from '@env';
import { useNavigation } from "@react-navigation/native";

const BusStopSearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [busStops, setBusStops] = useState([]);
    const [isCityModalVisible, setCityModalVisible] = useState(false);
    const [cityList, setCityList] = useState([]);
    const [selectedCityCode, setSelectedCityCode] = useState(null);
    const [selectedCityName, setSelectedCityName] = useState(null);
    const [searchTextToCode, setSearchTextToCode] = useState([]);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가
    const navigation = useNavigation();

    useEffect(() => {
        getCityCode();
    }, []);

    const getCityCode = () => {
        const url = BUS_API_URL;
        const serviceName = BUS_INFO_SERVICE;
        const functionName = CITY_INFO_F;
        const params = {
            serviceKey: decodeURIComponent(E_BUS_API_SERVICE_KEY),
            _type: 'json',
        };
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}${serviceName}/${functionName}?${queryString}`;
        console.log("도시코드 리스트", fullUrl);
        fetch(fullUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const body = data.response.body || {};
                const items = body.items ? body.items.item : [];
                const sortedItems = items.sort((a, b) => a.cityname.localeCompare(b.cityname)); // 이름 순으로 정렬
                setCityList(sortedItems);
            })
            .catch(error => console.error('There has been a problem with your fetch operation:', error));
    };

    const nameToCode = () => {
        setLoading(true); // 로딩 시작
        console.log("nameToCode 에서의 text=", searchText);
        const url = BUS_API_URL;
        const serviceName = BUS_STOP_SERVICE;
        const functionName = NAME_TO_CODE_F;
        const params = {
            serviceKey: decodeURIComponent(E_BUS_API_SERVICE_KEY),
            _type: 'json',
            cityCode: selectedCityCode,
            nodeNm: searchText
        };
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}${serviceName}/${functionName}?${queryString}`;
        console.log("정류소 이름 to id", fullUrl);
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
                setSearchTextToCode(items);
                console.log(items) // Store all nodeno and nodeNm values in searchTextToCode
            })
            .catch(error => console.error('There has been a problem with your fetch operation:', error))
            .finally(() => setLoading(false)); // 로딩 종료
    };

    const selectCity = (cityCode, cityName) => {
        setSelectedCityCode(cityCode);
        setSelectedCityName(cityName);
        console.log("선택된 도시 코드:",cityCode);
        console.log("선택된 도시 이름:",cityName);
        setCityModalVisible(false);
    };

    const renderCityModal = () => {
        return (
            <Modal
                visible={isCityModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCityModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {cityList.map((city) => (
                                <TouchableOpacity
                                    key={city.citycode}
                                    style={styles.cityButton}
                                    onPress={() => selectCity(city.citycode, city.cityname)}
                                >
                                    <Text style={styles.cityButtonText}>{city.cityname}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCityModalVisible(false)}>
                            <Text style={styles.closeButtonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="정류소 이름을 입력하세요"
                    placeholderTextColor="#aaa"
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => setCityModalVisible(true)}>
                    <Text style={styles.searchButtonText}>
                        {selectedCityCode ? `선택된 도시: ${selectedCityName}` : '도시 선택'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchButton} onPress={nameToCode}>
                    <Text style={styles.searchButtonText}>검색</Text>
                </TouchableOpacity>
            </View>

            {loading ? ( // 로딩 상태일 때 로딩 인디케이터 표시
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#333" />
                </View>
            ) : (
                <FlatList
                    data={searchTextToCode}
                    keyExtractor={item => item.nodeno.toString()} // Use nodeno as keyExtractor
                    style={styles.busItems}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.busItem} onPress={() => navigation.navigate("Bus", { item, selectedCityCode })}>
                            <Text style={styles.busName}>정류소 ID: {item.nodeid}</Text>
                            <Text style={styles.busName}>정류소 이름: {item.nodenm}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No bus stops found</Text>}
                />
            )}

            <View style={styles.paginationContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {/* Render pagination buttons */}
                </ScrollView>
            </View>

            {renderCityModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    searchButton: {
        marginLeft: 10,
        backgroundColor: '#333',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    searchButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 13
    },
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
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '70%',
    },
    cityButton: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cityButtonText: {
        fontSize: 16,
        color: '#333',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BusStopSearchScreen;
