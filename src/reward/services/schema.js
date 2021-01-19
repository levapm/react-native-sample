import SimpleSchema from 'simpl-schema';

import { RewardTypes } from '../constants';

export default new SimpleSchema({
    title: {
        type: String,
    },
    requiredPoints: {
        min: 1,
        type: Number,
    },
    type: {
        type: String,
        defaultValue: RewardTypes.POINT,
        allowedValues: Object.values(RewardTypes),
    },
    value: {
        min: 1,
        type: Number,
    },
    productId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
    },
    storeId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    expiresAt: {
        type: Date,
        optional: true,
    },
    isActive: {
        type: Boolean,
        defaultValue: true,
    }
});