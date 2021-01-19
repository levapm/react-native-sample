import React from 'react';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { ListItem, List, Spinner, Body, Text, Right, Icon } from 'native-base';

import common from '../../styles/common';
import { findProductExtras } from '../services/data';
import { formatAmount } from '../../shared/services/utils';

const ProductContainerExtraList = ({
    extras,
    extrasReady,
    selectedIds = [],
    inverted = false,
    onPress,
}) => {
    if (!extrasReady) {
        return (<Spinner />);
    }

    const nameStyle = inverted ? common.textWhite : {},
        descStyle = inverted ? common.textFadedLight : {};

    return (
        <List>
            {extras.map(ex => (
                <ListItem 
                    key={ex._id}
                    onPress={() => onPress(ex)}
                >
                    <Body>
                        <Text style={nameStyle}>{ex.name}</Text>
                        <Text note style={descStyle}>{ex.description}</Text>
                    </Body>
                    <Right>
                        <Text note style={descStyle}>${formatAmount(ex.price)}</Text>
                    </Right>
                    {selectedIds.indexOf(ex._id) >= 0 && (
                        <Right>
                            <Icon name="checkmark" />
                        </Right>
                    )}
                </ListItem>
            ))}
        </List>
    );
};

export default withTracker(props => {
    const extrasReady = Meteor.subscribe('productExtra.list').ready(),
        extras = extrasReady ? findProductExtras() : [];

    return {    
        extras,
        extrasReady,
        ...props,
    };
})(ProductContainerExtraList);