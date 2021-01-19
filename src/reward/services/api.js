import { omit } from 'lodash';
import { Alert } from "react-native";
import Meteor, { Mongo } from '@foysalit/react-native-meteor';

import i18n from '../../i18n';
import { apiCall } from '../../shared/services/utils';

export const Rewards = new Mongo.Collection('rewards');

export const findRewards = (filters) => {
    return Rewards.find(filters);
};

export const saveReward = async (reward) => {
    try {
        const { picture } = reward;

        // if a new reward, make sure at least one picture is being attached with it
        if (!reward._id && !picture) {
            Alert.alert("Picture Missing", "Please upload at least one picture for the reward.");
            return null;
        }

        const user = Meteor.user();
        reward.storeId = user.profile.storeId;

        const methodName = (reward._id) ? 'reward.update' : 'reward.insert';
        const rewardId = await apiCall(methodName, [omit(reward, 'picture')]);

        if (rewardId) {
            // if there is a pic but without id, means it's been added
            if (picture && !picture._id) {
                await apiCall('image.insert', ['reward', reward._id || rewardId, picture.uri]);
            }

            return rewardId;
        }

        return null;
    } catch (err) {
        Alert.alert('Error adding reward', err.message, [{ text: 'Close' }]);
    }
};

export const removeReward = (reward) => {
    Alert.alert(
        i18n.t('reward.removeConfirmTitle', reward), 
        i18n.t('reward.removeConfirmMessage'),
        [
            {text: i18n.t('reward.removeConfirmCancel'), style: 'cancel'}, 
            {text: i18n.t('reward.removeConfirmOk'), onPress: async () => {
                try {
                    await apiCall('reward.remove', [reward._id]);
                    Alert.alert(i18n.t('reward.removeSuccessTitle'), i18n.t('reward.removeSuccessMessage', reward), [{ text: 'Close' }]);
                } catch (err) {
                    Alert.alert('Error removing reward', err.message, [{ text: 'Close' }]);
                }
            }
        }]
    );
};