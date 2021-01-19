import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';

const PackComponentEmpty = () => (
    <View style={[common.fullHeightWithHeaderAndFooter, common.verticalCenter]}>
        <View style={[common.alignCenter]}>
            <Icon name="cube" style={[common.fs50]} />
            <Text style={[common.textCenter, common.fs25]}>
                {i18n.t('pack.empty')}
            </Text>
        </View>
    </View>
);

export default PackComponentEmpty;