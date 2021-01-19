import Meteor, { ReactiveDict } from '@foysalit/react-native-meteor';

export const apiCall = (method, params) => {
    return new Promise((resolve, reject) => {
        Meteor.call(method, ...params, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
};

const appState = new ReactiveDict();

export const getAppState = (key = '') => {
    return appState.get(key);
};

export const setAppState = (key = '', value) => {
    return appState.set(key, value);
};

export const formatAmount = (amount) => parseFloat(amount).toFixed(2);
export const parseCurrency = (amount) => Number(formatAmount(amount));