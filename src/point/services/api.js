import Meteor from '@foysalit/react-native-meteor';

import { apiCall } from '../../shared/services/utils';

export const awardPoints = async (point) => {
    const user = Meteor.user();
    point.awardedBy = user._id;
    point.awardedAt = new Date();
    point.storeId = user.profile.storeId;
    const pointId = await apiCall('point.insert', [point]);

    return pointId;
};
