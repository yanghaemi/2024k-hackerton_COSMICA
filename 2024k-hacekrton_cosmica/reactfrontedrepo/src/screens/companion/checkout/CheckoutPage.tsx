import React, { useState } from "react";
import { Alert, Button } from "react-native";
import { PaymentWidgetProvider, usePaymentWidget, AgreementWidget, PaymentMethodWidget } from "@tosspayments/widget-sdk-react-native";
import type { AgreementWidgetControl, PaymentMethodWidgetControl, AgreementStatus } from "@tosspayments/widget-sdk-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchFunc } from "../fetch/FetchFunc";

const CheckoutPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const paymentWidgetControl = usePaymentWidget();
    const [paymentMethodWidgetControl, setPaymentMethodWidgetControl] = useState<PaymentMethodWidgetControl | null>(null);
    const [agreementWidgetControl, setAgreementWidgetControl] = useState<AgreementWidgetControl | null>(null);

    const handlePaymentRequest = async () => {
        if (!paymentWidgetControl || !agreementWidgetControl) {
            Alert.alert("주문 정보가 초기화되지 않았습니다.");
            return;
        }

        const agreementStatus = await agreementWidgetControl.getAgreementStatus();
        if (!agreementStatus.agreedRequiredTerms) {
            Alert.alert("약관에 동의하지 않았습니다.");
            return;
        }

        try {
            const result = await paymentWidgetControl.requestPayment({
                orderId: item.id,
                orderName: "동행자 매칭 서비스",
            });

            if (result?.success) {
                console.log("ResultSuccess: ", result.success);
                fetchFunc("/appointment/pay", result.success)
                    .then(({status,data})=>{
                        fetchFunc("/appointment/payComplete",item)
                            .then(response=>{
                                Alert.alert("신청이 완료되었습니다.");
                            })
                    })
            } else if (result?.fail) {
                Alert.alert("결제 실패");
            }
        } catch (error) {
            console.error('Error during payment request:', error);
            Alert.alert("결제 중 오류가 발생했습니다.");
        } finally {
            navigation.navigate("CalendarPage");
        }
    };

    return (
        <>
            <PaymentMethodWidget
                selector="payment-methods"
                onLoadEnd={() => {
                    paymentWidgetControl
                        .renderPaymentMethods("payment-methods", { value: item.bill }, { variantKey: "DEFAULT" })
                        .then(control => setPaymentMethodWidgetControl(control));
                }}
            />
            <AgreementWidget
                selector="agreement"
                onLoadEnd={() => {
                    paymentWidgetControl
                        .renderAgreement("agreement", { variantKey: "DEFAULT" })
                        .then(control => setAgreementWidgetControl(control));
                }}
            />
            <Button title="결제요청" onPress={handlePaymentRequest} />
        </>
    );
}

export default CheckoutPage;
