import React from 'react';
import { format } from 'date-fns';
import { func } from "prop-types";
import { Alert } from 'react-native';
import { Text, Icon, CardItem, Button, Body, Right } from 'native-base';

import i18n from '../../i18n';
import { NoteType } from './note.type';

const Note = ({ note, onRemove }) => {
    const removeNote = (_id) => {
        Alert.alert(
            i18n.t('userNote.remove.title'),
            i18n.t('userNote.remove.description'),
            [
                { text: i18n.t('userNote.remove.cancelButton') },
                {
                    onPress: onRemove,
                    text: i18n.t('userNote.remove.confirmButton'), 
                },
            ]
        );
    };

    return (
        <CardItem>
            <Body>
                <Text>{note.content}</Text>
                <Text note>{format(note.createdAt, 'DD MMM, YY [at] h:mm a')}</Text>
            </Body>
            <Right>
                <Button
                    transparent
                    onPress={removeNote}
                    testID="noteRemoveButton"
                >
                    <Icon name="trash" />
                </Button>
            </Right>
        </CardItem>
    );
};

Note.propTypes = {
    note: NoteType.isRequired,
    onRemove: func.isRequired,
};

export default Note;