import { Toast } from "native-base";
import { Platform } from "react-native";
import Meteor from '@foysalit/react-native-meteor';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

import { apiCall } from '../../shared/services/utils';
import { increaseUnseenOrderCount } from "../../order/services/state";

export async function registerForPushNotifications() {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // dont send to server if user already has this device registered
    const user = Meteor.user();
    if (user && user.expoTokens && user.expoTokens.indexOf(token) >= 0) {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return await apiCall('users.notification.subscribe', [token]);
};

export function unregisterFromNotification() {
    // Get the token that uniquely identifies this device
    return Notifications.getExpoPushTokenAsync()
        .then(token => apiCall('users.notification.unsubscribe', [token]))
        .catch(err => console.log('error unregistering from notifications', err));
}

export function handleInAppNotification(handleSelect) {
    // ios doesnt show noti when app is in foreground so we need to show a toast
    // console.log('adding push notification handler');
    Notifications.addListener((notification) => {
        // console.log('got push noti', notification);
        if (Platform.OS == 'ios') {
            const toastOptions = {
                duration: 1000 * 15,
                text: notification.data.title,
            };

            if (!!handleSelect) {
                toastOptions.buttonText = 'Show';
                toastOptions.onClose = (reason) => reason === 'user' && handleSelect(notification);
            }

            Toast.show(toastOptions);
        }

        if (notification.origin == 'selected') {
            if (!!handleSelect)
                handleSelect(notification);
        }

        if (notification.data.type === 'order' && notification.data.title.indexOf('New Order') >= 0) {
            increaseUnseenOrderCount();
        }
    });
};