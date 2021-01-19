import SimpleSchema from 'simpl-schema';

export default new SimpleSchema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    price: {
        type: Number,
    },
    variations: {
        type: Array,
        optional: true,
    },
    'variations.$': Object,
    'variations.$.name': {
        type: String,
    },
    'variations.$.description': {
        optional: true,
        type: String,
    },
    'variations.$.price': {
        type: Number,
    },
    storeId: {
        type: String,
        optional: true,
        regEx: SimpleSchema.RegEx.Id,
    },
    isActive: {
        type: Boolean,
        optional: true,
        defaultValue: false,
    },
});