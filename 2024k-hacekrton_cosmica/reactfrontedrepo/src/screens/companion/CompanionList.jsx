import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BottomNavigation, Text as PaperText } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import {fetchFunc} from "./fetch/FetchFunc";

const HomeRoute = () => <PaperText>Home</PaperText>;
const SearchRoute = () => <PaperText>Search</PaperText>;
const ProfileRoute = () => <PaperText>Profile</PaperText>;

const CompanionList = () => {
    const navigation = useNavigation();
    const [index, setIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [appointment, setAppointment] = useState([]); // 기존 동행자들을 비워둡니다

    const renderScene = BottomNavigation.SceneMap({
        home: HomeRoute,
        search: SearchRoute,
        profile: ProfileRoute,
    });

    const fetchData = (url, additionalData1) => {
        fetchFunc(url,additionalData1)
            .then(data => {
                console.log('Success:', data);
                setAppointment(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.selectedDate}>{`${selectedDate} 가능 동행자`}</Text>

            <FlatList
                data={appointment}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DetailAppointment', { item })}>
                        <Text>동행자: {item.companionId}</Text>
                        <Text>장소: {item.location} 금액: {item.bill} </Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={() =>
                    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AppointmentRegister')}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>} // 리스트의 마지막에 버튼 추가
                style={styles.recyclerView}
            />

            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    fetchData("/appointment/search", day);
                }}
                style={styles.calendarView}
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
    button: {
        backgroundColor: '#fff', // 흰색 배경
        borderColor: '#ccc', // 연한 회색 테두리
        borderWidth: 1, // 테두리 두께A
        borderRadius: 4, // 모서리 둥글기
        padding: 6, // 버튼 내부 여백
        marginBottom: 1, // 버튼 아래 간격
    },
});

export default CompanionList;
