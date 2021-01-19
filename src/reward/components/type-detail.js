import React from 'react';
import PropTypes from 'prop-types';
import { CardItem, Icon, Text } from 'native-base';
import { withTracker } from '@foysalit/react-native-meteor';

import i18n from '../../i18n';
import common from '../../styles/common';
import { RewardTypes } from '../constants';
import { findProducts } from '../../product/services/data';

const RewardComponentTypeDetails = ({ reward, product }) => {
    if (!reward.type || !reward.value)
        return null;

    let icon, text;
    const rewardValue = reward.value;

    if (reward.type === RewardTypes.PRODUCT) {
        icon = 'pricetags';
        text = i18n.t('reward.redeem.typeProductDetail', {rewardValue, productName: product && product.name});
    } else if (reward.type === RewardTypes.CASHBACK) {
        icon = 'cash';
        text = i18n.t('reward.redeem.typeCashbackDetail', {rewardValue, });
    } else if (reward.type === RewardTypes.PERCENTAGE) {
        icon = 'cash';
        text = i18n.t('reward.redeem.typePercentageDetail', {rewardValue, });
    }

    return (
        <CardItem bordered>
            <Icon name={icon} style={common.fs20}/>
            <Text>{text}</Text>
        </CardItem>
    );
};

export default withTracker(props => {
    let {product} = props.reward;

    if (!product && props.reward.type === RewardTypes.PRODUCT && props.reward.productId) {
        product = findProducts({ _id: props.reward.productId })[0];
    }

    return {...props, product };
})(RewardComponentTypeDetails);