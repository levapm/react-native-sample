import React from 'react';
import { format } from 'date-fns';
import { PropTypes } from 'prop-types';
import { Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text, Body, Icon, Button } from "native-base";

import i18n from '../../i18n';
import common from '../../styles/common';
import { findRewardPicture } from '../../image/services/api';

import RewardComponentTypeDetail from './type-detail';

const RewardComponentSummary = ({ 
    reward, onRedeem, isRedeemable, showRedeemButton,
    onSelect
}) => {
    let { picture } = reward;

    if (!picture)
        picture = findRewardPicture(reward._id);

    return (
        <Card>
            <CardItem button={!!onSelect} onPress={() => !!onSelect ? onSelect() : null}>
                <Body>
                    <Text>
                        {reward.title}
                    </Text>
                </Body>
            </CardItem>

            {picture && (
                <CardItem cardBody>
                    <TouchableOpacity style={{flex: 1}} onPress={() => !!onSelect ? onSelect() : null}>
                        <Image
                            source={{ uri: picture.uri }}
                            style={{ height: 150, width: null, flex: 1 }}
                        />
                    </TouchableOpacity>
                </CardItem>
            )}

            <RewardComponentTypeDetail reward={reward} />

            <CardItem bordered>
                <Icon name="gift" style={common.fs20}/>
                <Body>
                    <Text>Points Needed</Text>
                </Body>
                <Body style={common.flexReverse}>
                    <Text style={[isRedeemable && common.textPrimary]}>
                        {reward.requiredPoints}
                    </Text>
                </Body>
            </CardItem>

            <CardItem bordered>
                <Icon name="calendar" style={common.fs15} />
                <Body>
                    <Text note>Expires on {format(reward.expiresAt, 'DD MMM, YY')}</Text>
                </Body>
            </CardItem>

            {showRedeemButton && (
                <CardItem>
                    <Body>
                        <Button
                            full
                            small
                            transparent
                            onPress={onRedeem}
                            disabled={!isRedeemable}
                        >
                            <Icon name="checkmark-circle" />
                            <Text>{ i18n.t('reward.redeem.buttonText') }</Text>
                        </Button>
                    </Body>
                </CardItem>
            )}
        </Card>
    );
};

RewardComponentSummary.propTypes = {
    onSelect: PropTypes.func,
    onRedeem: PropTypes.func,
    isRedeemable: PropTypes.bool,
    showRedeemButton: PropTypes.bool,
    reward: PropTypes.object.isRequired,
};

export default RewardComponentSummary;