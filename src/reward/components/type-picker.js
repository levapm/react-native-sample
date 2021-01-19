import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Row, Col, View, Text, Icon } from 'native-base';

import common from '../../styles/common';
import colors from '../../styles/colors';
import { RewardTypes } from '../constants';
import i18n from '../../i18n';

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: colors.light,
        ...common.mx10, ...common.alignCenter,
        ...common.px10, ...common.py15, ...common.br5,
    },
    selectedContainer: {
        ...common.bgLight
    },
});

const getIcon = (type) => {
    if (type === RewardTypes.PRODUCT)
        return 'pricetags';
    
    return 'cash';
}

const RewardComponentTypePicker = ({ reward, onSelect }) => {
    return (
        <Row>
            {Object.values(RewardTypes).map(type => {
                const isSelected = type === reward.type;

                return (
                    <Col key={type}>
                        <TouchableOpacity 
                            onPress={() => onSelect(type)}
                            style={[styles.container, isSelected && styles.selectedContainer]}
                        >
                            <Icon 
                                name={getIcon(type)} 
                                style={[!isSelected ? common.textWhite : common.textPrimary]}
                            />
                            <Text style={[common.textCenter, !isSelected ? common.textWhite : common.textPrimary]}>
                                {i18n.t(`reward.creator.typeText.${type}`)}
                            </Text>
                        </TouchableOpacity>
                    </Col>
                )
            })}
        </Row>
    );
};

export default RewardComponentTypePicker;