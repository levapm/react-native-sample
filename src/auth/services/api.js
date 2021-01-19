import { Alert } from "react-native";
import SimpleSchema from "simpl-schema";
import Meteor from '@foysalit/react-native-meteor';

import { unregisterFromNotification, registerForPushNotifications } from "../../user/services/notifications";

export function logout(onLogout) {
    return Alert.alert('Confirm Sign Out', 'You will have to sign in with again to get all the goodies of our platform.', [{
        text: 'Stay In', onPress: () => null, style: 'cancel',
    }, {
        text: 'Sign Out', onPress: () => {
            unregisterFromNotification().then(() => { Meteor.logout(); onLogout() });
        }
    }]);
};

export function login(email, password, cb) {
    Meteor.loginWithPassword(email, password, (err) => {
        if (err) {
            let { message } = err;
            if (message.indexOf('forbidden') >= 0) {
                message = "Invalid credentials. Please make sure the email and password is correct.";
            }

            Alert.alert('Error Signing In', message, [{
                text: 'Retry',
            }]);

            return cb(err);
        }

        registerForPushNotifications()
            .then(() => cb(null))
            .catch((err) => { console.log(err); cb(); });
    });
};

export function register(userData, cb) {
    Meteor.call('users.register', userData, (err) => {
        if (err) {
            let { message, details } = err;

            if (details) {
                message = `${details[0].message}`;
            }

            Alert.alert('Error signing up', message, [{
                text: 'Retry',
            }]);

            cb(err);
        } else {
            return login(userData.email, userData.password, cb);
        }
    });
};

export function showAuthPopup(featureName = null, onPress) {
    const message = `${featureName || 'This feature'} is only available to registered users of Naao. Please login or create an account.`
    Alert.alert('Sign In Required', message, [{text: 'Cancel'}, {
        text: 'Sign In', onPress
    }]);
};

export const RegistrationSchema = new SimpleSchema({
    name: {
        type: String,
        min: 3
    },
    email: {
        type: SimpleSchema.RegEx.Email
    },
    password: {
        type: String,
        min: 6
    },
    confirm_password: {
        type: String,
        min: 6,
        custom() {
            if (this.value !== this.field('password').value) {
                return 'passwordMissMatch';
            }
        }
    },
});

RegistrationSchema.messageBox.messages({
    en: {
        passwordMissMatch: "Passwords do not match"
    }
});