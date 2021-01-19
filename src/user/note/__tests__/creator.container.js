import React from 'react';
import { render, fireEvent, act, flushMicrotasksQueue } from 'react-native-testing-library';

import * as services from '../../services/api';
import NoteCreator from '../creator.container';

services.saveUserNote = jest.fn().mockResolvedValue(true);
const notifyNoteSaving = jest.fn();

describe('<NoteCreator />', () => {
    it('Renders content and button', async () => {
        const userId = 'testuserid';
        const content = 'test note is here';
        const { getByTestId } = render((<NoteCreator 
            userId={userId}
            notifyNoteSaving={notifyNoteSaving}
        />));

        act(() => {
            fireEvent(getByTestId('userNoteContentInput'), 'onChangeText', content);    
        });

        act(() => {
            fireEvent(getByTestId('userNoteSaveButton'), 'onPress');
        });
        
        await flushMicrotasksQueue();
        expect(services.saveUserNote).toHaveBeenCalledWith(content, userId);
        expect(notifyNoteSaving).toHaveBeenCalledTimes(2);
    });
});
