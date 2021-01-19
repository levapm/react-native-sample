import React from 'react';
import { StyleSheet } from 'react-native';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Button, Icon, View, Content, Container, Header, Right, Left, Body, Title, Spinner, Text } from 'native-base';

import Signin from './containers/signin';
import Signup from './containers/signup';
import AuthHeader from './header.component';

import common from '../styles/common';
import colors from '../styles/colors';

const styles = StyleSheet.create({
    promoSection: {
        borderLeftWidth: 0.3,
        ...common.verticalCenter,
        borderLeftColor: colors.fadedLight,
    },
    promoText: {
        ...common.fs30,
        ...common.px50,
        ...common.mx50,
        ...common.fontBold,
        ...common.textWhite,
        ...common.textCenter,
    },
});

class AuthPage extends React.Component {
    state = {
        section: 'signin',
    };
    
    componentDidUpdate (prevProps) {
        if (this.props.userId && !prevProps.userId) {
            this.onSignin();
        }
    };

    changeSection = () => {
        let section = 'signin';

        if (this.state.section === 'signin') {
            section = 'signup';
        }

        this.setState({ section });
    };

    onSignin = () => {
        const { navigation } = this.props,
            { state: { params } } = navigation;

        // console.log('signed in', params);
        if (params && params.onComplete) {
            return params.onComplete();
        }

        if (params && params.returnTo) {
            navigation.navigate(params.returnTo);
        } else {
            navigation.navigate("SharedPageStack");
        }
    };

    render() {
        const sectionMap = {
            signin: Signin,
            signup: Signup,
        };
        const menuMap =  {
            signin: 'contact',
            signup: 'log-in'
        };

        const { section } = this.state,
            CurrentSection = sectionMap[section],
            CurrentMenuIcon = menuMap[section];

        return (
            <Container style={[common.bgPrimary]}>
                <Header transparent>
                    <Left />
                    <Body>
                        <Title style={[ common.textPrimary ]}>Account</Title>
                    </Body>
                    <Right>
                        <Button
                            light
                            transparent
                            onPress={this.changeSection}
                        >
                            <Icon name={CurrentMenuIcon} />
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={[common.verticalCenter, common.fullHeightWithHeader,]}>
                        <View style={[common.flexRow, common.fullWidth]}>
                            <View style={[common.halfWidth]}>
                                <AuthHeader />

                                {this.props.isLoggingIn ? (
                                    <Spinner color={colors.light}/>
                                ) : (
                                    <CurrentSection
                                        onSignin={this.onSignin}
                                        navigation={this.props.navigation} />
                                )}
                            </View>
                            <View style={[common.halfWidth, styles.promoSection]}>
                                <Text style={styles.promoText}>
                                    One Stop Solution For Your Store.
                                </Text>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    };
};

export default withTracker(props => {
    return {
        userId: Meteor.userId(),
        isLoggingIn: Meteor.loggingIn(),
        ...props,
    };
})(AuthPage);