import { Alert } from 'react-native';
import { isString } from 'lodash';

import { apiCall } from '../../shared/services/utils';

export const saveStore = async (store={}) => {
    try {
        await apiCall('store.update', [store]);
    } catch (err) {
        Alert.alert('Error adding store', err.message, [{ text: 'Close' }]);
    }
};

export const addStorePicture = async (storeId, uri) => {
    return await apiCall('image.insert', ['store', storeId, uri]);
};

export const dateRangeToFilter = (range) => {
    if (isString(range)) {
        const [$gt, $lt] = range.split('-');
        range = { $gt: new Date($gt), $lt: new Date($lt) };
    }

    return range;
};

export const loadSummaryStats = async (range) => {
    return await apiCall('store.summarize', [{ createdAt: dateRangeToFilter(range) }]);
};

export const loadDateGroupStats = async (range) => {
    return await apiCall('store.stat.dateGroup', [{ createdAt: dateRangeToFilter(range) }]);
};