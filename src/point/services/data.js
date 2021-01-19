import Meteor, { Mongo } from '@foysalit/react-native-meteor';

export const Points = new Mongo.Collection('points');
export const PointCounts = new Mongo.Collection('pointCounts');

export const findPoints = (filters={}) => {
    return Points.find(filters, {sort: { awardedAt: -1 }});
};

export const findPointCountForUser = (ownerId) => {
    const user = Meteor.user();
    var storeId = null;

    if (user) {
        var { storeId } = user.profile;
    }

    return PointCounts.findOne({ ownerId, storeId });
};