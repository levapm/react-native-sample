import React from 'react';
import { Text } from 'native-base';

import common from '../../styles/common';
import { getStatusColor } from '../services/helpers';

export default ({ order }) => (
    <Text style={[getStatusColor(order.status), common.textCapitalized]}>
        {order.status}
    </Text>
);