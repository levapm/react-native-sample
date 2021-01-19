import Meteor, { Mongo } from '@foysalit/react-native-meteor';

export const Rewards = new Mongo.Collection('rewards');

export const findRewards = (filters = {}, options = {}) => {
    return Rewards.find(filters, { sort: { createdAt: -1 }, ...options });
};