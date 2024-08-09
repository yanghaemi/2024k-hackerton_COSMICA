import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { fetchFunc } from "./fetch/FetchFunc";
import Config from "react-native-config";

const CalendarPage = () => {
    const navigation = useNavigation();
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const [appointment, setAppointment] = useState([]); // 기존 동행자들을 비워둡니다

    const fetchData = (url, additionalData1) => {
        fetchFunc(url, additionalData1)
            .then(data => {
                console.log('Success:', data);
                setAppointment(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const renderItem = ({ item }) => {
        // item이 item.wheelchairId와 item.companionId를 모두 가지고 있는 경우 표시하지 않음
        if (item.wheelchairId !== 0 && item.companionId !== 0) {
            return null;
        }

        return (
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('DetailAppointment', { item })}
            >
                <Text style={styles.text}>
                    {item.companionId === 0 ? '휠체어 이용자' : '동행자'}
                </Text>
                <Text style={styles.text}>장소: {item.location}</Text>
                <Text style={styles.text}>금액: {item.bill}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.selectedDate}>{`${selectedDate} 가능 동행자`}</Text>
            {/*item= appointment*/}
            <FlatList
                data={appointment}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                ListFooterComponent={() =>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AppointmentRegister', { selectedDate })}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                }
                style={styles.recyclerView}
            />

            <Calendar
                onDayPress={(day) => {
                    setSelectedDate(day.dateString);
                    fetchData("/appointment/search", day);
                    console.log("url=" + Config.API_URL);
                }}
                style={styles.calendarView}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // 연한 회색 배경
    },
    selectedDate: {
        marginTop: 20,
        fontSize: 22,
        fontWeight: '700',
        color: '#333', // 진한 회색 텍스트
        textAlign: 'center',
    },
    recyclerView: {
        flex: 1,
        marginTop: 16,
        paddingHorizontal: 16,
    },
    calendarView: {
        marginBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#DDD',
    },
    addButton: {
        width: 30,
        height: 30,
        borderRadius: 30, // 동그란 버튼
        backgroundColor: '#007BFF', // 파란색 배경
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        alignSelf: 'center',
        shadowColor: '#000', // 그림자 색
        shadowOffset: { width: 0, height: 4 }, // 그림자 위치
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 6, // 그림자 블러
    },
    addButtonText: {
        fontSize: 15, // 크기 조정
        color: '#FFF',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#FFF', // 흰색 배경
        borderColor: '#DDD', // 연한 회색 테두리
        borderWidth: 1,
        borderRadius: 8, // 둥근 모서리
        padding: 12, // 버튼 내부 여백
        marginBottom: 8, // 버튼 아래 간격
        shadowColor: '#000', // 그림자 색
        shadowOffset: { width: 0, height: 2 }, // 그림자 위치
        shadowOpacity: 0.1, // 그림자 투명도
        shadowRadius: 4, // 그림자 블러
    },
    text: {
        fontWeight: '600', // 중간 두께의 글씨체
        fontSize: 16,
        color: '#333', // 진한 회색 텍스트
    },
});

export default CalendarPage;
