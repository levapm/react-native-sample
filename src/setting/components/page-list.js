import React from 'react';
import { PropTypes } from 'prop-types';
import { List, ListItem, Left, Icon, Text, Body } from 'native-base';

import { SettingPages } from '../services/pages';

const SettingComponentPageList = ({ onSelect, selected={} }) => (
    <List>
        <ListItem itemHeader first>
            <Text>General</Text>
        </ListItem>
        {SettingPages.map((page, i) => (
            <ListItem 
                icon 
                button
                key={page.text}
                last={SettingPages.length === (i+1)}
                onPress={() => onSelect(page)}
                selected={selected && selected.text === page.text}
            >
                <Left>
                    <Icon name={page.icon} />
                </Left>

                <Body>
                    <Text>{ page.text }</Text>
                </Body>
            </ListItem>
        ))}
    </List>
);

SettingComponentPageList.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.object,
};

export default SettingComponentPageList;