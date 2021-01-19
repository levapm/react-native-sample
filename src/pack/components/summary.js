import React from 'react';
import { format } from 'date-fns';
import { Image } from 'react-native';
import { PropTypes } from 'prop-types';
import { Card, CardItem, Text, Body, Icon, Button } from "native-base";

import i18n from '../../i18n';
import common from '../../styles/common';

import PackComponentTypeDetail from './type-detail';

const PackComponentSummary = ({ 
    pack, onAward, showAwardButton,
    onSelect
}) => {
    return (
        <Card>
            <CardItem 
                bordered
                button={!!onSelect} 
                onPress={() => !!onSelect ? onSelect() : null}
            >
                <Body>
                    <Text>
                        {pack.title}
                    </Text>
                </Body>
            </CardItem>

            <PackComponentTypeDetail pack={pack} />

            <CardItem bordered>
                <Icon name="gift" style={common.fs20}/>
                <Body>
                    <Text>Points</Text>
                </Body>
                <Body style={common.flexReverse}>
                    <Text style={common.textPrimary}>
                        {pack.points}
                    </Text>
                </Body>
            </CardItem>

            {showAwardButton && (
                <CardItem>
                    <Body>
                        <Button
                            full
                            small
                            transparent
                            onPress={onAward}
                        >
                            <Icon name="checkmark-circle" />
                            <Text>{ i18n.t('pack.award.buttonText') }</Text>
                        </Button>
                    </Body>
                </CardItem>
            )}
        </Card>
    );
};

PackComponentSummary.propTypes = {
    onSelect: PropTypes.func,
    onAward: PropTypes.func,
    showAwardButton: PropTypes.bool,
    pack: PropTypes.object.isRequired,
};

export default PackComponentSummary;