import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import fetchFunc4 from '../fetch/FetchFunc4'; // fetchFunc4 import

const CustomComponent = () => {
    const navigation = useNavigation();

    const handleCompanionPress = async () => {
        try {
            const userInfo = await fetchFunc4('/users/myInfo');
            console.log('userInfo: ', userInfo);
            if (userInfo.status === 401 || userInfo.status === 400) {
                Alert.alert('로그인이 필요한 서비스입니다.');
                navigation.navigate('Login'); // 로그인 화면으로 이동
            } else {
                navigation.navigate('CompanionStack'); // 동행자 매칭 스택으로 이동
            }
        } catch (error) {
            Alert.alert('서버에 문제가 생겼습니다. 나중에 다시 이용해주세요.');
            console.error('Error:', error);
            navigation.navigate('Login'); // 로그인 화면으로 이동
        }
    };

    const handleBusPress = () => {
        navigation.navigate('BusStack');
    };

    const handleMyPagePress = () => {
        navigation.navigate('MyPageStack');
    };

    return (
        <View style={styles.container}>
            {/* 첫 번째 아이콘 (동행자 매칭) */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleCompanionPress}
            >
                <Image source={require('../image/동행자.png')} style={styles.icon} />
            </TouchableOpacity>

            {/* 두 번째 아이콘 (버스) */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleBusPress}
            >
                <Image source={require('../image/버스.jpg')} style={styles.icon} />
            </TouchableOpacity>

            {/* 세 번째 아이콘 (MY 텍스트) */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleMyPagePress}
            >
                <Text style={styles.text}>MY</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#ffffff', // Background color for the container
        padding: 12, // Padding inside the container
        marginBottom: 10, // Margin at the bottom of the container
        marginHorizontal: 10, // Margin on the left and right sides
        alignItems: 'center',
        justifyContent: 'space-around', // Evenly space the buttons
        borderRadius: 10, // Rounded corners for the container
        elevation: 3, // Add some shadow for depth (works on Android)
        shadowColor: '#000', // Shadow color (for iOS)
        shadowOffset: { width: 0, height: 2 }, // Shadow offset (for iOS)
        shadowOpacity: 0.25, // Shadow opacity (for iOS)
        shadowRadius: 3.84, // Shadow radius (for iOS)
    },
    button: {
        flex: 1, // Make buttons take up equal space
        alignItems: 'center', // Center align the content inside buttons
        paddingVertical: 8, // Vertical padding for the button
        paddingHorizontal: 12, // Horizontal padding for the button
    },
    icon: {
        width: 40, // Fixed width for icons
        height: 40, // Fixed height for icons
        resizeMode: 'contain', // Maintain aspect ratio of the icon
    },
    text: {
        fontSize: 24, // Font size for the text button
        color: 'black', // Text color
        fontWeight: 'bold', // Text weight
        textAlign: 'center', // Center text alignment
    },
});

export default CustomComponent;
