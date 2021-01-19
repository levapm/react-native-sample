import SimpleSchema from 'simpl-schema';

import { StoreTypes } from '../constants';
export const HomeDeliverySchema = new SimpleSchema({
    isActive: {
        type: Boolean,
        defaultValue: true,
    },

    timetable: {
        type: Object,
        blackbox: true,
        defaultValue: {},
    },

    radius: {
        type: Number,
        defaultValue: 5,
    },
});

export const StorePickupSchema = new SimpleSchema({
    isActive: {
        type: Boolean,
        defaultValue: true,
    },

    timetable: {
        type: Object,
        blackbox: true,
        defaultValue: {},
    },
});

export const StoreBannerSchema = new SimpleSchema({
    isActive: {
        type: Boolean,
        defaultValue: true,
    },

    content: {
        type: String,
        defaultValue: '',
    },
});

export default new SimpleSchema({
    name: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    type: {
        type: String,
        allowedValues: Object.values(StoreTypes),
    },
    acceptsOnlineOrder: {
        type: Boolean,
        defaultValue: true,
    },
    homeDelivery: {
        type: HomeDeliverySchema,
        optional: true,
    },
    storePickup: {
        type: StorePickupSchema,
        optional: true,
    },
    banners: {
        type: Array,
    },
    'banners.$': {
        type: StoreBannerSchema,
    },
});