import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import fetchFunc3 from "../companion/fetch/FetchFunc3";
import {useFocusEffect, useNavigation} from "@react-navigation/native";

const MyPage = () => {
    const [myData, setMyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const myDataResponse = await fetchFunc3("/users/myInfo");
                    setMyData(myDataResponse);
                    console.log("My info in MyPage", myDataResponse);
                } catch (err) {
                    setError(err);
                    Alert.alert("Error", "Failed to load data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );


    const logout = async()=>{
        try {
            const logoutData = await fetchFunc3("/users/logout");
            setMyData(null);
        }
        catch (err) {
            setError(err);
            Alert.alert("Error", "로그아웃 실패");
        } finally {
            setLoading(false);
        }
    }


    if (loading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>Failed to load data.</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Top Profile Section */}
            <View style={styles.profileSection}>
                {/*<Image source={require('./assets/person.png')} style={styles.profileImage} />*/}
                <View style={styles.profileText}>
                    <Text style={styles.userName}>{myData?.userName || '사용자 이름'}</Text>
                    <Text style={styles.userType}>사용자 유형: {myData?.userType || '사용자 유형'}  |  평점: {myData?.rate} </Text>
                </View>
            </View>

            {/* Project Information Section */}
            <View style={styles.projectSection}>
                <Text style={styles.sectionTitle}>나의 활동 내역</Text>
                <View style={styles.projectInfo}>
                    <View style={styles.projectItem}>
                        <Text style={styles.itemLabel}>경로저장</Text>
                        <Text style={styles.itemValue}>{myData?.projectInfo?.routesSaved || 'N/A'}</Text>
                    </View>
                    <View style={styles.projectItem}>
                        <Text style={styles.itemLabel}>리뷰</Text>
                        <Text style={styles.itemValue}>{myData?.projectInfo?.reviews || 'N/A'}</Text>
                    </View>
                    <View style={styles.projectItem}>
                        <Text style={styles.itemLabel}>신고</Text>
                        <Text style={styles.itemValue}>{myData?.projectInfo?.reports || 'N/A'}</Text>
                    </View>
                </View>

                {/* Custom Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                        <Text style={styles.buttonText}>저장한 경로</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                        <Text style={styles.buttonText}>리뷰 내역</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                        <Text style={styles.buttonText}>신고 내역</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Other Section */}
            <View style={styles.otherSection}>
                <View style={styles.otherItem}>
                    {/*<Image source={require('./assets/message.png')} style={styles.otherIcon} />*/}
                    <Text style={styles.otherText}>동행 횟수</Text>
                    <Text style={styles.otherCount}>{myData?.times || '0'}</Text>
                </View>
                <View style={styles.otherItem}>
                    {/*<Image source={require('./assets/coupon.png')} style={styles.otherIcon} />*/}
                    <Text style={styles.otherText}>거주 지역</Text>
                    <Text style={styles.otherCount}>{myData?.location || '거주지역'}</Text>
                </View>
            </View>

            {/* Add Account and Logout Section */}
            <View style={styles.accountSection}>
                <View style={styles.accountItem}>
                    {myData ? (
                        <TouchableOpacity style={styles.customButton} onPress={logout}>
                            <Text style={styles.buttonText}>로그아웃</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.customButton} onPress={() => {navigation.navigate("Login")}}>
                            <Text style={styles.buttonText}>로그인</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.historySection}>
                <Text style={styles.historyText}>동행자 이력</Text>
                {/*<Image source={require('./assets/note.png')} style={styles.historyIcon} />*/}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    profileSection: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
    },
    profileImage: {
        width: 50,
        height: 50,
    },
    profileText: {
        marginLeft: 8,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userType: {
        fontSize: 14,
        marginTop: 4,
    },
    projectSection: {
        backgroundColor: '#ffffff',
        marginTop: 16,
        padding: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    projectInfo: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-around',
    },
    projectItem: {
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 14,
    },
    itemValue: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    customButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
    },
    otherSection: {
        backgroundColor: '#ffffff',
        marginTop: 16,
        padding: 16,
        elevation: 2,
    },
    otherItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    otherIcon: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    otherText: {
        fontSize: 14,
    },
    otherCount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    accountSection: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 16,
        justifyContent: 'center',
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    accountIcon: {
        width: 24,
        height: 24,
        marginLeft: 8,
    },
    historySection: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        padding: 16,
        marginTop: 30,
    },
    historyText: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    historyIcon: {
        width: 30,
        height: 36,
    },
});

export default MyPage;
