import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';

const RewardComponentEmpty = () => (
    <View style={[common.fullHeightWithHeaderAndFooter, common.verticalCenter]}>
        <View style={[common.alignCenter]}>
            <Icon name="gift" style={[common.fs50]} />
            <Text style={[common.textCenter, common.fs25]}>
                {i18n.t('reward.empty')}
            </Text>
        </View>
    </View>
);

export default RewardComponentEmpty;