import { pick } from 'lodash';

import { getItemsFromBasket } from './basket';
import { apiCall } from '../../shared/services/utils';

export const placeOrder = async (data) => {
    let total = 0;
    const items = getItemsFromBasket(),
        products = Object.values(items).map(item => {
            total += item.total;

            return {
                _id: item.product._id,
                variations: Object.values(item.variations),
                ...pick(item, ['total', 'itemId', 'extras']),
            };
        });

    const order = { ...data, products, total, placedAt: new Date, status: 'pending' };
    return await apiCall('order.insert', [order]);
};

export const rejectOrder = (orderId, reason) => apiCall('order.reject', [orderId, reason]);
export const completeOrder = (orderId) => apiCall('order.complete', [orderId]);
export const acceptOrder = (orderId, eta) => apiCall('order.accept', [orderId, eta]);