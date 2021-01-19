import React from 'react';
import { Alert, ScrollView } from 'react-native';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Text, Col, Row, Card, CardItem, View, Spinner } from "native-base";

import i18n from '../../i18n';
import common from "../../styles/common";
import colors from '../../styles/colors';
import { findPacks } from '../services/data';
import { awardPoints } from '../../point/services/api';

import PackComponentSummary from '../components/summary';
import { getFullName } from '../../user/services/helpers';

const containerStyle = [
    common.mx15, common.mt15,
];

class PackContainerRedeem extends React.Component {
    confirmRedeem(pack) {
        const { user } = this.props,
            customerName = getFullName(user.profile);

        const title = i18n.t('pack.redeem.confirmTitle'),
            message = i18n.t('pack.redeem.confirmMessage', { ...pack, customerName });

        Alert.alert(title, message, [{
            text: 'Cancel'
        }, {
            text: 'Pack Customer',
            onPress: async () => {
                try {
                    const redemption = { packId: pack._id, ownerId: user._id, amount: -pack.requiredPoints },
                        pointId = await awardPoints(redemption);

                    if (pointId) {
                        const titleSuccess = i18n.t('pack.redeem.successTitle', { ...pack, customerName }),
                            messageSuccess = i18n.t('pack.redeem.successMessage', { ...pack, customerName });

                        Alert.alert(titleSuccess, messageSuccess, [{ text: 'Close' }]);
                    }
                } catch (err) {
                    Alert.alert("Error!", err.message, [{ text: 'Close' }]);
                }
            }
        }]);
    };

    render() {
        const { user, packsReady, packs } = this.props;

        return (
            <Row style={containerStyle}>
                <Col>
                    <Card style={{ borderColor: '#FFFFFF' }}>
                        <CardItem header bordered>
                            <Row>
                                <Col size={2}>
                                    <Text style={common.fs20}>
                                        {i18n.t('pack.redeem.header')}
                                    </Text>
                                </Col>
                                <Col size={1} style={common.flexReverse}>
                                    {!packsReady && (<Spinner size="small" color={colors.primary} style={{ height: 20 }} />)}
                                    <Text style={[common.mr10, common.textPrimary]}>
                                        { user.points.total } pts
                                    </Text>
                                </Col>
                            </Row>
                        </CardItem>

                        <View>
                            <ScrollView horizontal={true} style={[common.px15, common.py10]}>
                                {packs.map(pack => (
                                    <View 
                                        style={{ width: 280, marginRight: 10 }}
                                        key={pack._id}
                                    >
                                        <PackComponentSummary 
                                            isRedeemable={user.points.total >= pack.requiredPoints}
                                            onRedeem={() => this.confirmRedeem(pack)}
                                            showRedeemButton={true}
                                            pack={pack} 
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

    const packsSub = Meteor.subscribe('pack.list', filters),
        packs = packsSub.ready() ? findPacks(filters, {sort: {requiredPoints: 1}}) : [];
    
    return { ...props, packsReady: packsSub.ready(), packs };
})(PackContainerRedeem);