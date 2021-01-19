import { ReactiveDict } from '@foysalit/react-native-meteor';
import { startOfDay, endOfDay } from "date-fns";

const filterState = new ReactiveDict();
export const getPointFilterEndDate = () => filterState.get('endDate');
export const setPointFilterEndDate = (date) => filterState.set('endDate', endOfDay(date));
export const getPointFilterStartDate = () => filterState.get('startDate');
export const setPointFilterStartDate = (date) => filterState.set('startDate', startOfDay(date));
export const getPointFilterOwner = () => filterState.get('owner');
export const setPointFilterOwner = (owner) => filterState.set('owner', owner);