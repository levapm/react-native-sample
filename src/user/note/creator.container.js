import { string, func } from 'prop-types';
import React, { useState } from 'react';
import { Textarea, Form, Button, Text } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { saveUserNote } from '../services/api';

const NoteCreator = ({ userId, notifyNoteSaving }) => {
    const [savingNote, setSavingNote] = useState(false);
    const [note, setNote] = useState('');

    const saveNote = async () => {
        setSavingNote(true);
        notifyNoteSaving(true);
        
        await saveUserNote(note, userId);
        
        setNote('');
        setSavingNote(false);
        notifyNoteSaving(false);
    };

    return (
        <Form style={common.px10}>
            <Textarea
                bordered
                rowSpan={4}
                value={note}
                style={common.mb10}
                onChangeText={setNote}
                testID="userNoteContentInput"
            />

            <Button 
                full 
                onPress={saveNote} 
                testID="userNoteSaveButton"
                disabled={savingNote || note.length < 3}
            >
                <Text>{i18n.t('userNote.creator.saveButton')}</Text>
            </Button>
        </Form>
    );
};

NoteCreator.propTypes = {
    userId: string.isRequired,
    notifyNoteSaving: func.isRequired,
};

export default NoteCreator;