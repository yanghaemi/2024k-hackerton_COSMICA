import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import fetchFunc2 from "../../fetch/FetchFunc2";

const MyReview = ({ route }) => {
    const { appointments } = route.params; // 전달된 appointments 데이터 받기
    const [companions, setCompanions] = useState({}); // 각 appointment에 대한 동행자 데이터를 저장할 상태

    // 각각의 appointment에 대해 동행자 데이터를 가져오는 함수
    const companionData = async (appointmentId) => {
        try {
            const userDataResponse = await fetchFunc2("/users/findById", { id: appointmentId });
            setCompanions(prevState => ({
                ...prevState,
                [appointmentId]: userDataResponse,
            }));
        } catch (error) {
            console.log("리뷰 페이지 에러:", error);
        }
    };

    // appointment가 변경될 때마다 동행자 데이터를 가져오도록 useEffect 사용
    useEffect(() => {
        appointments.forEach(appointment => {
            companionData(appointment.companionId); // 동행자의 ID를 사용하여 데이터 가져옴
        });
    }, [appointments]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>리뷰 내역</Text>
            {appointments && appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                    appointment.review && (
                        <View key={index} style={styles.appointmentItem}>
                            <Text>동행자: {companions[appointment.companionId]?.userName || 'Loading...'}</Text>
                            <Text>날짜: {appointment.appointDate}</Text>
                            <Text>위치: {appointment.location}</Text>
                            <Text>비용: {appointment.bill}원</Text>
                            <Text>평점: {appointment.rate}</Text>
                            <Text>리뷰내용</Text>
                            <Text>{appointment.review}</Text>
                        </View>
                    )
                ))
            ) : (
                <Text>활동 내역 없음.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    appointmentItem: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
});

export default MyReview;
