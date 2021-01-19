import { Mongo } from '@foysalit/react-native-meteor';

export const Orders = new Mongo.Collection('orders');
export const DeliveryAddress = new Mongo.Collection('deliveryAddress');

export const findOrders = (filters = {}) => {
    return Orders.find(filters, {sort: {placedAt: -1}});
};

export const findOrder = (filters) => Orders.findOne(filters); 

export const findDeliveryAddressesOfUser = (userId) => DeliveryAddress.find({ userId });