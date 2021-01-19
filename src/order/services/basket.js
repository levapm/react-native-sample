import { Alert } from 'react-native';
import { isArray } from 'lodash';
import { ReactiveDict } from '@foysalit/react-native-meteor';

import i18n from '../../i18n';
import { parseCurrency } from '../../shared/services/utils';

const basketState = new ReactiveDict();

export const getItemsFromBasket = () => basketState.get('basketItems') || [];
export const addItemToBasket = (product, variations, total, extras) => {
    let items = getItemsFromBasket() || [],
        itemId = Math.random().toString(36).substring(2, 3) + Math.random().toString(36).substring(2, 6),
        item = { variations, total: parseCurrency(total), product, itemId };

    if (isArray(extras) && extras.length > 0)
        item.extras = extras;

    items.push(item);

    basketState.set('basketItems', items);
};

export const removeItemFromBasket = (itemId, variation) => {
    let items = getItemsFromBasket().map(item => {
        if (item.itemId !== itemId)
            return item;

        if (Object.keys(item.variations).length === 1) {
            return null;
        }

        const variety = item.variations[variation.name];
        let extraTotal = 0;
        if (item.extras && item.extras.length > 0) {
            extraTotal = item.extras.reduce((total, extra) => ((extra.qty * extra.price) + total), 0);
        }

        item.total -= (variety.price * variety.qty);
        item.total -= (extraTotal * variety.qty);
        delete item.variations[variation.name];

        return item;
    }).filter(Boolean);

    basketState.set('basketItems', items);
};

export const actuallyEmptyBasket = () => {
    basketState.set('basketItems', []);
};

export const emptyBasket = () => {
    Alert.alert(i18n.t('order.basket.emptyConfirmTitle'), i18n.t('order.basket.emptyConfirmMessage'), [{
        text: 'Cancel', style: 'cancel'
    }, {
        text: 'Clear Basket', onPress: actuallyEmptyBasket
    }]);
};

export const computeBasketTotal = () => {
    let total = 0;

    getItemsFromBasket().map(item => {
        total += item.total;
    });

    return total;
};

export const computeExtraMultiplier = (variations) => {
    const multiplier = Object.values(variations)
        .reduce((total, variety) => (variety.qty + total), 0);

    return multiplier > 0 ? multiplier : 1;
};