import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';

const CompanionList = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    // 데이터 요청 함수
    const fetchData = () => {
        setLoading(true); // 로딩 상태 시작
        fetch('http://172.30.128.131:8080/test', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                setUserData(data);
                setLoading(false); // 로딩 상태 종료
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false); // 로딩 상태 종료
            });
    };

    return (
        <View style={styles.container}>
            <Button title="Fetch Data" onPress={fetchData} />
            {loading && <Text>Loading...</Text>}
            {userData && (
                <View>
                    <Text>Data:</Text>
                    <Text>{JSON.stringify(userData)}</Text>
                </View>
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
    },
});

export default CompanionList;
