import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BottomNavigation, Text as PaperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { fetchFunc } from "./FetchFunc";

const HomeRoute = () => <PaperText>Home</PaperText>;
const SearchRoute = () => <PaperText>Search</PaperText>;
const ProfileRoute = () => <PaperText>Profile</PaperText>;

const CompanionList = () => {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'home', title: 'Home', icon: 'home' },
        { key: 'search', title: 'Search', icon: 'search' },
        { key: 'profile', title: 'Profile', icon: 'person' },
    ]);
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [companions, setCompanions] = useState([]); // 기존 동행자들을 비워둡니다

    const renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        search: SearchRoute,
        profile: ProfileRoute,
    });

    const fetchData = (url, additionalData1) => {
        fetchFunc(url, additionalData1)
            .then(data => {
                console.log('Success:', data);
                // fetched data를 companions에 설정 (예: data.companions가 리스트인 경우)
                setCompanions(data.companions);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const renderAddButton = () => (
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AppointmentRegister')} // 네비게이트 함수 사용
        >
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.selectedDate}>{`${selectedDate} 가능 동행자`}</Text>

            <FlatList
                data={companions} // 동행자 리스트가 빈 배열로 설정되어 있음
                renderItem={({ item }) => (
                    <View style={styles.companionItem}>
                        <Text>{item.name}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={renderAddButton} // 리스트의 마지막에 버튼 추가
                style={styles.recyclerView}
            />

            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    fetchData("/appointment/search", day);
                }}
                style={styles.calendarView}
            />

            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    selectedDate: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 18,
    },
    recyclerView: {
        flex: 1,
        marginTop: 16,
    },
    calendarView: {
        marginBottom: 64,
    },
    companionItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    addButton: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    addButtonText: {
        fontSize: 24,
        color: 'blue',
    },
});

export default CompanionList;
