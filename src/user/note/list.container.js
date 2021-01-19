import { string } from "prop-types";
import React, {useState} from 'react';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Text, Row, Col, Card, CardItem } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { findUserNotes, removeUserNote } from '../services/api';

import Note from './note.component';
import NoteHeader from './header.component';
import NoteCreator from './creator.container';

const UserContainerNoteList = ({ notes, notesReady, userId }) => {
    const [removingNote, setRemovingNote] = useState(false);
    const [showCreator, setShowCreator] = useState(false);

    const removeNote = async (_id) => {
        setRemovingNote(true);
        await removeUserNote(_id);
        setRemovingNote(false);
    };

    const handleNoteSaving = (isSaving) => {
        if (!isSaving)
            setShowCreator(false);
    };

    return (
        <Row style={[common.mx15, common.mt15]}>
            <Col>
                <Card style={{ borderColor: '#FFFFFF' }}>
                    <NoteHeader
                        notesReady={notesReady}
                        removingNote={removingNote}
                        showCreator={() => setShowCreator(true)}
                    />
                    {showCreator && (
                        <NoteCreator 
                            userId={userId} 
                            notifyNoteSaving={handleNoteSaving}
                        />
                    )}

                    {notesReady ? (notes.length > 0 ? notes.map(note => (
                        <Note
                            note={note}
                            key={note._id}
                            onRemove={() => removeNote(note._id)}
                        />
                    )) : (
                        <CardItem noBorder>
                            <Text>{i18n.t('userNote.list.empty')}</Text>
                        </CardItem>
                    )) : null}
                </Card>
            </Col>
        </Row>
    );
};

UserContainerNoteList.propTypes = {
    userId: string.isRequired,
};

export default withTracker(props => {
    const notesReady = Meteor.subscribe('users.notes').ready(),
        notes = notesReady ? findUserNotes(props.userId) : [];

    return {
        notesReady, notes,
        ...props
    };
})(UserContainerNoteList);