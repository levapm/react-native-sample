import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

jest.mock('Alert', () => {
    return {
        alert: jest.fn()
    }
});

import Note from '../note.component';

const NoteMock = {
    createdAt: new Date(),
    content: 'this is a test note',
    targetUserId: 'asdfasdfasdf',
    authorId: 'asdfasdfasdf',
    storeId: 'asdfasdfasdf',
};

describe('<Note />', () => {
    it('Renders content and button', () => {
        const tree = render((<Note note={NoteMock} onRemove={() => null} />)).toJSON();
        expect(tree.children.length).toMatchSnapshot();
    });

    it('Renders content and button', () => {
        const mockRemove = jest.fn();
        const { getByTestId } = render((<Note note={NoteMock} onRemove={mockRemove} />));

        fireEvent(getByTestId('noteRemoveButton'), 'onPress');
        expect(Alert.alert).toHaveBeenCalled();
        
        // manually click the second button
        Alert.alert.mock.calls[0][2][1].onPress();
        expect(mockRemove).toHaveBeenCalled();
    });
});
