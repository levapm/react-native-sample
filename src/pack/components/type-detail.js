import React from 'react';
import PropTypes from 'prop-types';
import { CardItem, Icon, Text } from 'native-base';
import { withTracker } from '@foysalit/react-native-meteor';

import i18n from '../../i18n';
import common from '../../styles/common';
import { PackTypes } from '../constants';
import { getIcon } from '../services/helper';
import { findProducts } from '../../product/services/data';

const PackComponentTypeDetails = ({ pack, product }) => {
    if (!pack.type || !pack.requiredValue)
        return null;

    let icon = getIcon(pack.type), 
        params = { packValue: pack.requiredValue };

    if ([PackTypes.PRODUCT_QTY, PackTypes.PRODUCT_TOTAL].indexOf(pack.type) >= 0) {
        params.productName = product && product.name;
    }

    return (
        <CardItem bordered>
            <Icon name={icon} style={common.fs20}/>
            <Text>{i18n.t(`pack.award.typeText.${pack.type}`, params)}</Text>
        </CardItem>
    );
};

export default withTracker(props => {
    let {product} = props.pack;

    if (!product && props.pack.type === PackTypes.PRODUCT && props.pack.productId) {
        product = findProducts({ _id: props.pack.productId })[0];
    }

    return {...props, product };
})(PackComponentTypeDetails);