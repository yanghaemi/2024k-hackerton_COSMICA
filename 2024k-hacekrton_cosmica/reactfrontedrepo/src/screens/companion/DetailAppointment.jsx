import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {fetchFunc2} from "./fetch/FetchFunc2";
import {useNavigation} from "@react-navigation/native";

const DetailAppointment = ({ route }) => {
    const url = "/users/findById";
    const navigation = useNavigation();
    const { item } = route.params;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 비동기 데이터를 처리하는 fetchData 함수를 정의합니다.
        const fetchData = () => {
            console.log(item.companionId);
            fetchFunc2(url, { id: item.companionId })
                .then(data => {
                    setUserData(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err);
                    setLoading(false);
                });
        };

        fetchData();
    }, [url, item.companionId]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text>동행자: {userData.userName}</Text>
            <Text>장소: {item.location}       날짜: {item.appointDate}</Text>
            <Text>평점: {userData.rate}      금액: {item.bill}</Text>
            <Text>총 동행 횟수: {userData.times}</Text>
            <Button title="신청하기" onPress={() => navigation.navigate("CheckoutPage")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    }
});

export default DetailAppointment;
