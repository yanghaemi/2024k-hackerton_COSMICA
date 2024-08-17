import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export default function CustomComponent() {
    return (
        <View style={styles.container}>
            {/* 첫 번째 아이콘 */}
            <Image source={require('../image/동행자.png')} style={styles.icon} />

            {/* 두 번째 아이콘 (버스) */}
            <Image source={require('../image/버스.jpg')} style={styles.icon} />

            {/* 세 번째 아이콘 (MY 텍스트) */}
            <Text style={styles.text}>MY</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff', // rounded_rectangle_bg에 해당하는 색상으로 변경
        padding: 16,
        marginBottom: 8,
        marginStart: 5,
        marginEnd: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10, // rounded_rectangle_bg에 해당하는 radius로 설정
    },
    icon: {
        flex: 1,
        resizeMode: 'contain',
        marginEnd: 8,
    },
    text: {
        flex: 1,
        fontSize: 36,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        marginEnd: 8,
    },
});