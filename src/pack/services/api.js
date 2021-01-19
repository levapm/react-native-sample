import { omit } from 'lodash';
import { Alert } from "react-native";
import Meteor, { Mongo } from '@foysalit/react-native-meteor';

import i18n from '../../i18n';
import { apiCall } from '../../shared/services/utils';

export const Packs = new Mongo.Collection('packs');

export const findPacks = (filters) => {
    return Packs.find(filters);
};

export const savePack = async (pack) => {
    try {
        const { picture } = pack;

        const user = Meteor.user();
        pack.storeId = user.profile.storeId;

        const methodName = (pack._id) ? 'pack.update' : 'pack.insert';
        const packId = await apiCall(methodName, [omit(pack, 'picture')]);

        return packId;
    } catch (err) {
        Alert.alert('Error adding pack', err.message, [{ text: 'Close' }]);
    }
};

export const removePack = (pack) => {
    Alert.alert(
        i18n.t('pack.removeConfirmTitle', pack), 
        i18n.t('pack.removeConfirmMessage'),
        [
            {text: i18n.t('pack.removeConfirmCancel'), style: 'cancel'}, 
            {text: i18n.t('pack.removeConfirmOk'), onPress: async () => {
                try {
                    await apiCall('pack.remove', [pack._id]);
                    Alert.alert(i18n.t('pack.removeSuccessTitle'), i18n.t('pack.removeSuccessMessage', pack), [{ text: 'Close' }]);
                } catch (err) {
                    Alert.alert('Error removing pack', err.message, [{ text: 'Close' }]);
                }
            }
        }]
    );
};