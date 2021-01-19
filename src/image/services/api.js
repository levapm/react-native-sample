import { isString } from 'lodash';
import { Alert } from 'react-native';
import Meteor, { Mongo } from '@foysalit/react-native-meteor';

import { apiCall } from '../../shared/services/utils';

export const Images = new Mongo.Collection('images');

export const findStorePictures = (storeId) => {
    return findImagesForEntry('store', storeId);
};

export const findProductPictures = (productId) => {
    return findImagesForEntry('product', productId);
};

export const findRewardPicture = (rewardId) => {
    return findImageForEntry('reward', rewardId);
};

const findImagesForEntry = (moduleName, parentId) => {
    return Images.find({
        'meta.module': moduleName,
        'meta.parentId': parentId,
    }).map(pic => ({ ...pic, uri: formatFleURL(pic) }));
};

const findImageForEntry = (moduleName, parentId) => {
    const pic = Images.findOne({
        'meta.module': moduleName,
        'meta.parentId': parentId,
    });

    if (pic)
        pic.uri = formatFleURL(pic);
    
    return pic;
};

export const removeImage = async (_id) => {
    try {
        await apiCall('image.remove', [_id]);
        Alert.alert("Picture Removed", "Picture has been removed successfully.");
    } catch (err) {
        Alert.alert('Error removing picture', err.message, [{text: 'Close'}]);
    }
};

const formatFleURL = (fileRef = {}, version = 'original') => {
    let ext;

    const _root = Meteor.getData()._endpoint
        .replace(/\/+$/, '')
        .replace('ws://', 'http://')
        .replace('wss://', 'https://')
        .replace('/websocket', '');
    const vRef = (fileRef.versions && fileRef.versions[version]) || fileRef || {};

    if (isString(vRef.extension)) {
        ext = `.${vRef.extension.replace(/^\./, '')}`;
    } else {
        ext = '';
    }

    if (fileRef.public === true) {
        return _root + (version === 'original' ? `${fileRef._downloadRoute}/${fileRef._id}${ext}` : `${fileRef._downloadRoute}/${version}-${fileRef._id}${ext}`);
    }
    return _root + `${fileRef._downloadRoute}/${fileRef._collectionName}/${fileRef._id}/${version}/${fileRef._id}${ext}`;
};