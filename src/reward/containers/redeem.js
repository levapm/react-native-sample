import React from 'react';
import { Alert, ScrollView } from 'react-native';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Text, Col, Row, Card, CardItem, View, Spinner } from "native-base";

import i18n from '../../i18n';
import common from "../../styles/common";
import colors from '../../styles/colors';
import { findRewards } from '../services/data';
import { awardPoints } from '../../point/services/api';

import RewardComponentSummary from '../components/summary';
import { getFullName } from '../../user/services/helpers';

const containerStyle = [
    common.mx15, common.mt15,
];

class RewardContainerRedeem extends React.Component {
    confirmRedeem(reward) {
        const { user } = this.props,
            customerName = getFullName(user.profile);

        const title = i18n.t('reward.redeem.confirmTitle'),
            message = i18n.t('reward.redeem.confirmMessage', { ...reward, customerName });

        Alert.alert(title, message, [{
            text: 'Cancel'
        }, {
            text: 'Reward Customer',
            onPress: async () => {
                try {
                    const redemption = { rewardId: reward._id, ownerId: user._id, amount: -reward.requiredPoints },
                        pointId = await awardPoints(redemption);

                    if (pointId) {
                        const titleSuccess = i18n.t('reward.redeem.successTitle', { ...reward, customerName }),
                            messageSuccess = i18n.t('reward.redeem.successMessage', { ...reward, customerName });

                        Alert.alert(titleSuccess, messageSuccess, [{ text: 'Close' }]);
                    }
                } catch (err) {
                    Alert.alert("Error!", err.message, [{ text: 'Close' }]);
                }
            }
        }]);
    };

    render() {
        const { user, rewardsReady, rewards } = this.props;

        return (
            <Row style={containerStyle}>
                <Col>
                    <Card style={{ borderColor: '#FFFFFF' }}>
                        <CardItem header bordered>
                            <Row>
                                <Col size={2}>
                                    <Text style={common.fs20}>
                                        {i18n.t('reward.redeem.header')}
                                    </Text>
                                </Col>
                                <Col size={1} style={common.flexReverse}>
                                    {!rewardsReady && (<Spinner size="small" color={colors.primary} style={{ height: 20 }} />)}
                                    <Text style={[common.mr10, common.textPrimary]}>
                                        { user.points.total } pts
                                    </Text>
                                </Col>
                            </Row>
                        </CardItem>

                        <View>
                            <ScrollView horizontal={true} style={[common.px15, common.py10]}>
                                {rewards.map(reward => (
                                    <View 
                                        style={{ width: 280, marginRight: 10 }}
                                        key={reward._id}
                                    >
                                        <RewardComponentSummary 
                                            isRedeemable={user.points.total >= reward.requiredPoints}
                                            onRedeem={() => this.confirmRedeem(reward)}
                                            showRedeemButton={true}
                                            reward={reward} 
                                        />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </Card>
                </Col>
            </Row>
        );
    };
};

export default withTracker(props => {
    const storeUser = Meteor.user();
    let filters = {};

    if (storeUser) {
        filters.storeId = storeUser.profile.storeId;
    }

    const rewardsSub = Meteor.subscribe('reward.list', filters),
        rewards = rewardsSub.ready() ? findRewards(filters, {sort: {requiredPoints: 1}}) : [];
    
    return { ...props, rewardsReady: rewardsSub.ready(), rewards };
})(RewardContainerRedeem);