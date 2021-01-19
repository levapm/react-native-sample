import React from 'react';
import { Text, View } from 'native-base';

import common from '../styles/common';

const AuthHeader = () =>  (
    <View style={[common.mb15, common.mx15]}>
        <Text style={[common.fontBold, common.fs25, common.textLight]}>
            RIFT BUSINESS
        </Text>
    </View>
);

export default AuthHeader;