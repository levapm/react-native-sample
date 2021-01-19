import SimpleSchema from 'simpl-schema';

export const AccountSchema = new SimpleSchema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
});