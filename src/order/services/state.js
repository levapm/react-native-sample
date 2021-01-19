import { startOfDay, endOfDay } from "date-fns";
import { ReactiveDict } from '@foysalit/react-native-meteor';

import { OrderStatesEnum } from "../constants";

export const filterState = new ReactiveDict({
    status: [OrderStatesEnum.PENDING, OrderStatesEnum.PROCESSING]
});
export const getEndDateFilter = () => filterState.get('endDate');
export const setEndDateFilter = (date) => filterState.set('endDate', endOfDay(date));
export const getStartDateFilter = () => filterState.get('startDate');
export const setStartDateFilter = (date) => filterState.set('startDate', startOfDay(date));
export const getStatusFilter = () => filterState.get('status');
export const addStatusFilter = (status) => filterState.set('status', [status, ...getStatusFilter()]);
export const removeStatusFilter = (status) => filterState.set('status', getStatusFilter().filter(s => s !== status));

export const countState = new ReactiveDict({
    unseen: 0,
});
export const getUnseenOrderCount = () => countState.get('unseen');
export const resetUnseenOrderCount = () => countState.set('unseen', 0);
export const increaseUnseenOrderCount = () => countState.set('unseen', countState.get('unseen') + 1);