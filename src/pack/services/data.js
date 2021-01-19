import { Mongo } from '@foysalit/react-native-meteor';

export const Packs = new Mongo.Collection('packs');

export const findPacks = (filters = {}, options = {}) => {
    return Packs.find(filters, { sort: { createdAt: -1 }, ...options });
};