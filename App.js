import React from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import Meteor from '@foysalit/react-native-meteor';
import { Ionicons } from '@expo/vector-icons';
import { Root, StyleProvider } from 'native-base';
import { NavigationActions } from 'react-navigation';

import Config from './config';
import getTheme from './native-base-theme/components';

import MainPage from './src/shared/main.page';
import NativeBaseTheme from './src/styles/native-base-theme';
import { handleInAppNotification } from './src/user/services/notifications';

Meteor.connect(Config.apiUrl);
Meteor.subscribe('users.me');

export default class App extends React.Component {
    state = {
        isReady: false,
    };
    navigator = null;

    async componentWillMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            ...Ionicons.font,
        });

        this.setState({ isReady: true });
    };

    componentDidMount() {
        handleInAppNotification((notification) => {
            let action;

            switch (notification.data.type) {
                case 'order':
                    action = {
                        routeName: 'OrderPageHome',
                        params: { order: notification.data.order }
                    };
                    break;
                case 'checkin':
                    action = {
                        routeName: 'UserPageCheckedIn',
                        params: { user: notification.data.customer }
                    };
                default:
                    break;
            }

            this.navigator && this.navigator.dispatch(NavigationActions.navigate(action));
        });
    };

    render() {
        if (!this.state.isReady) {
            return <AppLoading />;
        }

        return (
            <StyleProvider style={getTheme(NativeBaseTheme)}>
                <Root>
                    <MainPage ref={nav => this.navigator = nav}/>
                </Root>
            </StyleProvider>
        );
    };
}