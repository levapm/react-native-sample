import { Mongo } from '@foysalit/react-native-meteor';

export const Stores = new Mongo.Collection('stores');

export const findStores = (filters = {}) => {
    return Stores.find(filters);
};