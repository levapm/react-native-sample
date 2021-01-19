import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { distanceInWordsToNow } from 'date-fns';
import { Text, Body, View, ListItem, Left, CardItem } from "native-base";

import common from '../../styles/common';
import { getFullName } from '../services/helpers';

const styles = StyleSheet.create({
    thumbnail: {
        borderRadius: 50,
        height: 50,
        width: 50,
    },
});

export function userThumbnailBackground(user) {
    const name = getFullName(user.profile);

    const colors = [
        '#ffbf00',
        '#b8860b',
        '#78ce26',
        '#dd4b39',
        '#ffc0cb',
        '#800080',
        '#2196f3',
    ];

    const code = name.charCodeAt(0);
    return colors[code%7];
};

const UserComponentSmallPreview = ({ inCard, user, selected, onSelect }) => {
    const thumbnailStyle = [
        common.alignCenter, common.verticalCenter, styles.thumbnail, 
        { backgroundColor: userThumbnailBackground(user) }
    ];

    const Comp = inCard ? CardItem : ListItem;
    return (
        <Comp
            avatar
            button={!!onSelect}
            selected={selected && user._id === selected._id}
            onPress={() => !!onSelect ? onSelect(user) : null}
        >
            <Left style={common.verticalCenter}>
                <View
                    style={thumbnailStyle}>
                    <Text style={[common.textWhite, common.fs20, common.ml0]}>
                        {getFullName(user.profile)[0]}
                    </Text>
                </View>
                <Body>
                    <Text>{getFullName(user.profile)}</Text>
                    <Text note>{distanceInWordsToNow(user.profile.checkedInAt)}</Text>
                </Body>
            </Left>
        </Comp>
    );
};

UserComponentSmallPreview.propTypes = {
    user: PropTypes.object.isRequired,
    selected: PropTypes.object,
    onSelect: PropTypes.func,
    inCard: PropTypes.bool,
};

export default UserComponentSmallPreview;