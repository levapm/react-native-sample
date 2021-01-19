import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from "react-native";
import { distanceInWordsToNow } from "date-fns";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Content, Text, Col, Icon, Row, Grid, Button, Spinner } from "native-base";

import i18n from '../../i18n';
import common from "../../styles/common";
import { findPacks } from '../../pack/services/api';
import { findUser, checkOutUser } from '../services/api';
import { setPointFilterOwner } from '../../point/services/state';
import { findPointCountForUser } from '../../point/services/data';
import { findLastCheckInForUser } from '../../check-in/services/data';

import { getFullName } from '../services/helpers';
import UserContainerNoteList from '../note/list.container';
import PointContainerAward from '../../point/containers/award';
import RewardContainerRedeem from '../../reward/containers/redeem';

class UserContainerCheckedInSingle extends React.Component {
    showPoints (user) {
        setPointFilterOwner(user);
        this.props.navigation.navigate('PointPageHistory', { user, returnTo: 'UserPageCheckedIn' });
    };

    showFirstCheckInHint = () => {
        Alert.alert(
            i18n.t('user.checkedIn.firstTimeHintTitle'),
            i18n.t('user.checkedIn.firstTimeHintMessage'),
        );
    };

    checkOut (user) {
        Alert.alert(
            i18n.t('user.checkedIn.confirmCheckOutTitle'),
            i18n.t('user.checkedIn.confirmCheckOutMessage'),
            [{
                text: i18n.t('user.checkedIn.confirmCheckOutCancel')
            }, {
                text: i18n.t('user.checkedIn.confirmCheckOutOk'),
                onPress: async () => {
                    try {
                        await checkOutUser(user._id);
                        this.props.onCheckOut(user);
                    } catch (err) {
                        Alert.alert(i18n.t('user.checkedIn.errprCheckOutTitle'), err.message);
                    }
                }
            }]
        )
    };
    
    render () {
        const { user, packs, packsReady } = this.props;

        if (!user) {
            return (<Content><Spinner /></Content>);
        }

        return (
            <Content>
                <Grid>
                    <Row style={[common.px15, common.py5]}>
                        <Col size={4}>
                            <Text style={[common.fs25]}>
                                {getFullName(user.profile)}
                            </Text>
                            <Text note>
                                Checked in {distanceInWordsToNow(user.profile.checkedInAt)} ago
                            </Text>
                        </Col>
                        <Col size={1} style={[common.flexReverse, common.pt10]}>
                            {!!this.props.onCheckOut && (
                                <Button
                                    small
                                    primary
                                    style={common.ml10}
                                    onPress={() => this.checkOut(user)}
                                >
                                    <Text>
                                        Check Out
                                    </Text>
                                </Button>
                            )}
                            {!!user.points && (
                                <Button
                                    small
                                    primary
                                    style={common.ml10}
                                    onPress={() => this.showPoints(user)}
                                >
                                    <Text>
                                        {user.points.total || 0}pts
                                    </Text>
                                </Button>
                            )}

                            {user.checkIn && user.checkIn.first && (
                                <Button
                                    small
                                    primary
                                    bordered
                                    style={common.ml10}
                                    onPress={this.showFirstCheckInHint}
                                >
                                    <Icon name='megaphone' />
                                </Button>
                            )}

                            <Button
                                small
                                primary
                                onPress={() => this.props.navigation.navigate('UserPageOrderCreate', {customerId: user._id})}
                            >
                                <Icon name="cart" />
                            </Button>
                        </Col>
                    </Row>

                    <UserContainerNoteList
                        userId={user._id}
                    />

                    <RewardContainerRedeem user={user} />
                </Grid>
            </Content>
        );
    }
};

UserContainerCheckedInSingle.propTypes = {
    userId: PropTypes.string.isRequired,
    onCheckOut: PropTypes.func,
};

export default withTracker(props => {
    const user = findUser(props.userId),
        packsSub = Meteor.subscribe('pack.list'),
        packsReady = packsSub.ready(),
        packs = packsReady ? findPacks() : [];

    if (user) {
        user.points = findPointCountForUser(user._id) || { total: 0 };
        user.checkIn = findLastCheckInForUser(user._id);
    }

    return {
        packs, packsReady, user, ...props
    };
})(UserContainerCheckedInSingle);