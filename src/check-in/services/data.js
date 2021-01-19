import { Mongo } from '@foysalit/react-native-meteor';

export const CheckIns = new Mongo.Collection('checkIns');

export const findLastCheckInForUser = (userId) => {
    return CheckIns.findOne({ userId }, { sort: { at: -1 } });
};