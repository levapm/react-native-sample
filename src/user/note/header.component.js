import React from 'react';
import { func, bool } from "prop-types";
import { Text, Spinner, Icon, CardItem, Button, Right } from 'native-base';

import i18n from '../../i18n';
import colors from '../../styles/colors';
import common from '../../styles/common';

const NoteHeader = ({ notesReady, removingNote, showCreator }) => (
    <CardItem header bordered>
        <Text style={common.fs20}>
            {i18n.t('userNote.list.header')}
        </Text>
        <Right>
            {(!notesReady || removingNote) && (
                <Spinner
                    size="small"
                    color={colors.primary}
                    style={{ height: 20 }}
                />)}
        </Right>
        <Right>
            <Button small transparent onPress={showCreator}>
                <Icon name="add" />
            </Button>
        </Right>
    </CardItem>
);

NoteHeader.propTypes = {
    showCreator: func.isRequired,
    notesReady: bool.isRequired, 
    removingNote: bool.isRequired, 
};

export default NoteHeader;