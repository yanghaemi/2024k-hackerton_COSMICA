import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
import fetchFunc3 from "../../fetch/FetchFunc3";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {fetchFunc} from "../../fetch/FetchFunc";
import CustomComponent from "../../components/CustomComponent";
import DocumentPicker from 'react-native-document-picker';
import {REACT_APP_SPRING_API_URL} from "@env";
import fetchFunc2 from "../../fetch/FetchFunc2";


const MyPage = () => {
    const [myData, setMyData] = useState(null);
    const [appointments, setAppointments] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [opponent,setOpponent]=useState(null);
    const navigation = useNavigation();

    const fetchData = async () => {
        setLoading(true);
        try {
            const myDataResponse = await fetchFunc3("/users/myInfo");
            setMyData(myDataResponse);
            console.log("My info in MyPage", myDataResponse);

            const myAppointmentResponse = await fetchFunc3("/appointment/my");
            setAppointments(myAppointmentResponse || []); // Ensure it's an array
            console.log("My appointments", myAppointmentResponse);
        } catch (err) {
            setError(err);
            Alert.alert("Error", "Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [refresh])
    );

    const getOpponent = (selected)=>{
        const request = myData.userType==='COMPANION'? selected.wheelchairId : selected.companionId;
        console.log(request);
        fetchFunc2("/users/findById", { id: request })
            .then(
                data=>{
                    setOpponent(data);
                    console.log(data);
                }
            )
    }

    const getUserType = (type) => {
        switch (type) {
            case 'COMPANION':
                return '동행자';
            case 'WHEELCHAIR':
                return '휠체어 이용자';
            default:
                return '사용자 유형';
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await fetchFunc3("/users/logout");
            setMyData(null);
            setAppointments([]);
            setRefresh(prev => !prev);
        } catch (err) {
            setError(err);
            Alert.alert("Error", "로그아웃 실패");
        } finally {
            setLoading(false);
        }
    };

    const openReviewModal = (appointment) => {
        setSelectedAppointment(appointment);
        setModalVisible(true);
    };

    const openHistoryModal = (appointment) => {
        setSelectedAppointment(appointment);
        getOpponent(appointment);
        setHistoryModalVisible(true);
    };

    const uploadPdf = async (fileUri) => {
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            type: 'application/pdf', // MIME 타입
            name: 'file.pdf',        // 서버에서 저장될 파일 이름
        });

        try {

            const response = await fetch(REACT_APP_SPRING_API_URL+'/users/verify', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };


    const submitReview = () => {
        console.log('Submitted Review:', reviewText, 'Rating:', rating);
        selectedAppointment.review = reviewText;
        selectedAppointment.rate = rating;
        fetchFunc("/appointment/review",selectedAppointment);
        console.log("선택된 매칭 리뷰 작성 결과:", selectedAppointment);
        setModalVisible(false);
    };

    const selectFile = async () => {
        try {
            console.log("selectFile 실행 됨.")
            // 파일 선택
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf], // PDF 파일만 선택 가능
            });

            console.log('선택된 파일:', res);
            const fileUri = res[0].uri;       // 선택된 파일의 URI
            uploadPdf(fileUri);               // 파일 전송 함수 호출
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('파일 선택이 취소되었습니다.');
            } else {
                console.error('파일 선택 중 오류 발생:', err);
            }
        }
    };

    // Ensure appointments is an array before calling filter
    const reviewCount = (Array.isArray(appointments) ? appointments.filter(appointment => appointment.review).length : 0);

    if (loading) {
        return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>Failed to load data.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* All other content goes here */}
                <View style={styles.profileSection}>
                    <View style={styles.profileText}>
                        <Text style={styles.userName}>{myData?.userName || '사용자 이름'}</Text>
                        <Text style={styles.userType}>사용자 유형: {getUserType(myData?.userType)}
                            {myData?.userType === 'COMPANION' && ` | 평점: ${myData?.rate}`}
                        </Text>
                    </View>
                </View>

                <View style={styles.projectSection}>
                    <Text style={styles.sectionTitle}>나의 활동 내역</Text>
                    <View style={styles.projectInfo}>
                        <View style={styles.projectItem}>
                            <Text style={styles.itemLabel}>경로저장</Text>
                            <Text style={styles.itemValue}>{myData?.projectInfo?.routesSaved || 'N/A'}</Text>
                        </View>
                        <View style={styles.projectItem}>
                            <Text style={styles.itemLabel}>리뷰</Text>
                            <Text style={styles.itemValue}>{reviewCount || 'N/A'}</Text>
                        </View>
                        <View style={styles.projectItem}>
                            <Text style={styles.itemLabel}>신고</Text>
                            <Text style={styles.itemValue}>{myData?.projectInfo?.reports || 'N/A'}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                            <Text style={styles.buttonText}>저장한 경로</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate("MyReview", { appointments })}>
                            <Text style={styles.buttonText}>리뷰 내역</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.customButton} onPress={() => {}}>
                            <Text style={styles.buttonText}>신고 내역</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.otherSection}>
                    <View style={styles.otherItem}>
                        <Text style={styles.otherText}>동행 횟수</Text>
                        <Text style={styles.otherCount}>{myData?.times || '0'}</Text>
                    </View>
                    <View style={styles.otherItem}>
                        <Text style={styles.otherText}>거주 지역</Text>
                        <Text style={styles.otherCount}>{myData?.location || '거주지역'}</Text>
                    </View>
                    { myData &&(
                        myData.userType==='COMPANION' && (
                            <View style={styles.otherItem}>
                                <Text style={styles.otherText}>복지사 인증 현황</Text>
                                <Text style={styles.otherCount}>{myData?.verify ? '인증 완료' :'인증 미완료'}</Text>
                            </View>
                        )
                    )}
                </View>

                <View style={styles.accountSection}>
                    <View style={styles.accountItem}>
                        {myData ? (
                            <View style={styles.accountItem}>
                                <TouchableOpacity style={styles.customButton} onPress={logout}>
                                    <Text style={styles.buttonText}>로그아웃</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.customButton,myData?.userType!=='COMPANION' &&styles.buttonDisabled]}
                                                  disabled={myData?.userType!=='COMPANION'}
                                                  onPress={selectFile}>
                                    <Text style={styles.buttonText}>사회 복지사 인증</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.customButton} onPress={() => { navigation.navigate("Login") }}>
                                <Text style={styles.buttonText}>로그인</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.historySection}>
                    <Text style={styles.historyText}>동행 이력</Text>
                    {appointments.length ? (
                        appointments.map((appointment, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.appointmentItem,
                                    !appointment.review && styles.noReviewItem, // review가 없으면 스타일 변경
                                ]}
                                onPress={()=>openHistoryModal(appointment)}
                            >
                                <Text>날짜: {appointment.appointDate}</Text>
                                <Text>위치: {appointment.location}</Text>
                                <Text>비용: {appointment.bill}원</Text>
                                {!appointment.review && myData?.userType === 'WHEELCHAIR' && (
                                    <Text style={styles.noReviewText}>리뷰 등록하기</Text> // 리뷰가 없는 경우 표시
                                )}
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No appointments found.</Text>
                    )}
                </View>
            </ScrollView>

            {/* CustomComponent fixed at the bottom */}
            <CustomComponent />

            <Modal
                animationType="slide"
                transparent={true}
                visible={historyModalVisible}
                onRequestClose={() => setHistoryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>동행 이력</Text>
                        {selectedAppointment && opponent? (
                            <View style={styles.appointmentItem}>
                                <Text style={styles.modalText}>날짜: {selectedAppointment.appointDate}</Text>
                                <Text style={styles.modalText}>위치: {selectedAppointment.location}</Text>
                                <Text style={styles.modalText}>비용: {selectedAppointment.bill}원</Text>
                                <Text style={styles.modalText}>상대방 번호:{opponent.phoneNum}</Text>
                                <View style={styles.modalButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.customButton}
                                        onPress={() => {
                                            if (myData?.userType === 'WHEELCHAIR') {
                                                if(selectedAppointment.wheelchairId && selectedAppointment.companionId) {
                                                    openReviewModal(selectedAppointment); // Modal 열기
                                                } else {
                                                    Alert.alert("매칭 상대 미정","아직 매칭상대가 정해지지 않아 리뷰를 등록할 수 없습니다.")
                                                }
                                            } else {
                                                Alert.alert("권한 없음", "리뷰 등록은 휠체어 이용자만 가능합니다.");
                                            }
                                        }} // Modal 열기
                                    >
                                        <Text style={styles.buttonText}>리뷰 등록</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.customButton}
                                                      onPress={()=>navigation.navigate("CheckoutPage", { selectedAppointment, opponent })}
                                    >
                                        <Text style={styles.buttonText}>결제하기</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <Text>동행 이력이 없습니다.</Text>
                        )}
                        <TouchableOpacity
                            style={styles.customButton}
                            onPress={() => setHistoryModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>닫기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>리뷰 작성</Text>
                        <Text>평점:</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        styles.ratingButton,
                                        rating === value && styles.selectedRatingButton,
                                    ]}
                                    onPress={() => setRating(value)}
                                >
                                    <Text style={styles.ratingButtonText}>{value}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text>리뷰:</Text>
                        <TextInput
                            style={styles.reviewInput}
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline
                            placeholder="리뷰를 작성해주세요."
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={submitReview}
                            >
                                <Text style={styles.modalButtonText}>제출</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 100, // Enough padding to make room for the fixed footer
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    profileSection: {
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    profileText: {
        marginLeft: 10,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userType: {
        fontSize: 16,
        marginTop: 5,
    },
    projectSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    projectInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    projectItem: {
        flex: 1,
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    customButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginHorizontal: 5, // 추가된 부분
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    otherSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    otherItem: {
        marginBottom: 10,
    },
    otherText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    otherCount: {
        fontSize: 16,
    },
    accountSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'center',  // 이 부분을 추가하세요.
    },
    historySection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    historyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appointmentItem: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    noReviewItem: {
        backgroundColor: '#f8d7da',
    },
    noReviewText: {
        color: '#721c24',
        fontWeight: 'bold',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    ratingButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    selectedRatingButton: {
        backgroundColor: '#3498db',
    },
    ratingButtonText: {
        fontSize: 16,
        color: '#fff',
    },
    reviewInput: {
        width: '100%',
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#3498db',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        lineHeight: 22,
        textAlign: 'left',
    },
});

export default MyPage;