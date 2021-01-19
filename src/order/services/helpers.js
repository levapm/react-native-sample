import { Platform, Linking, Alert } from 'react-native';

import common from '../../styles/common';
import { OrderStatesEnum, OrderPaymentMethods } from '../constants';

export const getStatusColor = (status = 'pending') => {
    switch (status) {
        case OrderStatesEnum.PENDING:
            return common.textWarning;
        case OrderStatesEnum.REJECTED:
            return common.textDanger;
        case OrderStatesEnum.COMPLETE:
            return common.textSuccess;
        case OrderStatesEnum.PROCESSING:
            return common.textPrimary;
    }
};

export const getPaymentMethodColor = (paymentMethod = OrderPaymentMethods.ACCOUNT_BALANCE) => {
    switch (paymentMethod) {
        case OrderPaymentMethods.ACCOUNT_BALANCE:
            return common.textWarning;
        case OrderPaymentMethods.CASH:
            return common.textDanger;
    }
};

export const showDeliveryAddressInMap = async (deliveryAddress) => {
    const addr = `${deliveryAddress.line1}, ${deliveryAddress.zip}, ${deliveryAddress.city}`,
        url = Platform.select({ 
            ios: 'https://maps.apple.com/maps?daddr='+ addr, 
            android: 'http://maps.google.com/maps?daddr='+ addr 
        });

    try {
        const supported = await Linking.canOpenURL(url);

        if (!supported) {
            Alert.alert("Error", "Sorry can't open map on your device");
        } else {
            return Linking.openURL(url);
        }
    } catch (err) {
        Alert.alert("Error", `Sorry can't open map on your device. ${err.message}`);
    }
};