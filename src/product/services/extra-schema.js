import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    name: {
        type: String,
    },
    description: {
        type: String,
        optional: true,
    },
    price: {
        type: Number,
    },
    storeId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    isActive: {
        type: Boolean,
        optional: false,
        defaultValue: false,
    },
});