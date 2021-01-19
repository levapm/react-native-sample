import SimpleSchema from 'simpl-schema';
import { PackTypes } from '../constants';

const PackProductSchema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    name: {
        type: String,
    },
    variation: {
        type: Object,
        optional: true,
    },
    'variation.name': {
        type: String,
    },
});

export default new SimpleSchema({
    points: {
        type: Number,
        min: 0,
    },
    type: {
        type: String,
        allowedValues: Object.values(PackTypes)
    },
    requiredValue: {
        type: Number,
    },
    title: {
        type: String,
    },
    note: {
        type: String,
        optional: true,
    },
    product: {
        type: PackProductSchema,
        optional: true,
    },
    storeId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    createdAt: {
        type: Date,
        optional: true,
        autoValue: function () {
            if (!this.isSet && this.isInsert)
                return new Date();

            this.unset();
        },
    },
    isAvailable: {
        type: Boolean,
        optional: true,
        defaultValue: true,
    }
});