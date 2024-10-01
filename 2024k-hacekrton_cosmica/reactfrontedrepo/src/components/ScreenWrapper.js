import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import CustomComponent from './CustomComponent'; // 경로 확인

const ScreenWrapper = ({ children }) => (
    <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.screenContainer}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {children}
            </ScrollView>
        </View>
        <CustomComponent />
    </SafeAreaView>
);

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
});

export default ScreenWrapper;
