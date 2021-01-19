import { shape, string, instanceOf } from 'prop-types';

export const NoteType = shape({
    storeId: string.isRequired,
    content: string.isRequired,
    authorId: string.isRequired,
    targetUserId: string.isRequired,
    createdAt: instanceOf(Date).isRequired,
});