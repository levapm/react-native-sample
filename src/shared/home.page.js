import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Container, Text, Col, Row, Grid, Spinner, Icon } from "native-base";

import common from "../styles/common";
import colors from "../styles/colors";
import { findStores } from "../store/services/data";
import SharedStatsContainer from "../store/summary-stats.container";
import SharedOrderStatsContainer from "../store/order-stats.container";
import { getFullName } from "../user/services/helpers";

const styles = StyleSheet.create({
    box: {
        borderWidth: 1,
        ...common.br5,
        borderColor: colors.primary,
    },
});

const boxes = [{
    text: 'Settings',
    page: 'SettingPageHome',
    icon: 'settings',
}, {
    text: 'Rewards',
    page: 'RewardPageHome',
    icon: 'gift',
}, {
    text: 'Point Packs',
    page: 'PackPageHome',
    icon: 'cube',
}, {
    text: 'Products',
    page: 'ProductPageHome',
    icon: 'pricetags',
}];

class SharedPageHome extends React.Component {
    pageBox = (box) => (
        <Col style={[common.px10]} key={box.page}>
            <TouchableOpacity 
                style={styles.box}
                onPress={() => this.props.navigation.navigate(box.page)}>
                <View style={[common.alignCenter, common.py25]}>
                    <Icon name={box.icon} style={common.textPrimary} />
                    <Text style={[common.fs25]}>{box.text}</Text>
                </View>
            </TouchableOpacity>
        </Col>
    );

    render() {
        const {user, store} = this.props;

        if (!user)
            return (<Spinner />);

        return (
            <Container style={[common.avoidStatusBar]}>
                <Grid style={[common.fullHeight, common.alignCenter]}>
                    <Row>
                        <Col>
                            <Row size={1}></Row>
                            <Row size={1}>
                                <Col style={[common.alignCenter]}>
                                    {!!store && (
                                        <Text style={common.fs25}>{store.name}</Text>
                                    )}
                                    <Text style={[common.fs20]}>Welcome {getFullName(user.profile)}</Text>
                                </Col>
                            </Row>
                            <Row size={3} style={[common.halfWidth]}>
                                <Col>
                                    <Row>
                                        {[boxes[0], boxes[1]].map(this.pageBox)}
                                    </Row>
                                    <Row>
                                        {[boxes[2], boxes[3]].map(this.pageBox)}
                                    </Row>
                                </Col>
                            </Row>
                            <Row size={1}></Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col style={[common.alignCenter]}>
                                    <SharedStatsContainer />
                                    <SharedOrderStatsContainer />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
};

export default withTracker((props) => {
    const user = Meteor.user();
    let store;

    if (user && user.profile.storeId)
        store = findStores({_id: user.profile.storeId})[0];

    return {
        user, store, ...props,
    };
})(SharedPageHome);