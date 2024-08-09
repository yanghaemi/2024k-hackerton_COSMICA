import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { fetchFunc2 } from "./fetch/FetchFunc2";
import { useNavigation } from "@react-navigation/native";
import fetchFunc3 from "./fetch/FetchFunc3";

const DetailAppointment = ({ route }) => {
    const url = "/users/findById";
    const navigation = useNavigation();
    const { item } = route.params;
    const [userData, setUserData] = useState(null);
    const [myData, setMyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 비동기 데이터를 처리하는 fetchData 함수를 정의합니다. null값일 때 0으로 나와서 0으로 3항연산자 사용하였습니다.
        const request = item.companionId === 0 ? item.wheelchairId : item.companionId;

        const fetchData = async () => {
            try {
                const userDataResponse = await fetchFunc2(url, { id: request });
                setUserData(userDataResponse);
                console.log("User info", userDataResponse);

                const myDataResponse = await fetchFunc3("/users/myInfo");
                setMyData(myDataResponse);
                console.log('My info:', myDataResponse);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, item.companionId]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    // 버튼을 비활성화할 조건을 정의합니다.
    const isButtonDisabled = userData && myData && userData.userType === myData.userType;

    return (
        <View style={styles.container}>
            <Text>
                {userData.userType === "WHEELCHAIR" ? `휠체어 이용자: ${userData.userName}` : `동행자: ${userData.userName}`}
            </Text>
            {/*item = appointment*/}
            <Text>장소: {item.location} 날짜: {item.appointDate}</Text>
            <Text>평점: {userData.rate} 금액: {item.bill}</Text>
            <Text>총 동행 횟수: {userData.times}</Text>
            <Button
                title="신청하기"
                onPress={() => navigation.navigate("CheckoutPage", { item })}
                disabled={isButtonDisabled} // 버튼 활성화/비활성화
            />
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
