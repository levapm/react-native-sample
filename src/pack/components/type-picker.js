import React from 'react';
import i18n from '../../i18n';
import { Text, Icon, ListItem, List, Left, Body, Right, Radio } from 'native-base';

import common from '../../styles/common';
import colors from '../../styles/colors';
import { PackTypes } from '../constants';
import { getIcon } from '../services/helper';

const PackComponentTypePicker = ({ pack, onSelect }) => {
    return (
        <List>
            {Object.values(PackTypes).map(type => {
                const isSelected = type === pack.type;

                return (
                    <ListItem 
                        button
                        noIndent
                        key={type} 
                        onPress={() => onSelect(type)}
                    >
                        <Left>
                            <Icon 
                                name={getIcon(type)} 
                                style={common.textWhite}
                            />
                            <Body>
                                <Text style={[common.textWhite, isSelected && common.fontBold]}>
                                    {i18n.t(`pack.creator.typeTitle.${type}`)}
                                </Text>
                                <Text note style={[common.textWhite]}>
                                    {i18n.t(`pack.creator.typeDescription.${type}`)}
                                </Text>
                            </Body>
                        </Left>
                        <Right>
                            <Radio 
                                selected={isSelected}
                                color={colors.fadedLight}
                                selectedColor={colors.light}
                                />
                        </Right>
                    </ListItem>
                )
            })}
        </List>
    );
};

export default PackComponentTypePicker;