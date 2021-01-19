import Meteor, { Mongo } from '@foysalit/react-native-meteor';

import { apiCall } from '../../shared/services/utils';
import { updateAsync } from '../../shared/services/collection-helpers';

export const UserNotes = new Mongo.Collection('userNotes');
export const Users = new Mongo.Collection('users');

Users.updateAsync = updateAsync;

export const findUser = (userId) => {
    return userId ? Users.findOne(userId) : null;
};

export const findCheckedInUsers = (storeId) => {
    return Users.find({ 'profile.checkedInStoreId': storeId });
};

export const checkOutUser = async (userId) => {
    const user = Meteor.user();
    return apiCall('store.customer.checkout', [userId, user.profile.storeId]);
};

export const saveUserNote = (note, targetUserId) => {
    return apiCall('users.note.add', [note, targetUserId]);
};

export const removeUserNote = (_id) => {
    return apiCall('users.note.remove', [_id]);
};

export const findUserNotes = (targetUserId) => {
    return UserNotes.find({ targetUserId }, { sort: {createdAt: -1} });
};