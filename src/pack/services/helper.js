import { PackTypes } from '../constants';

export const getIcon = (type) => {
    if (type === PackTypes.PRODUCT_QTY)
        return 'pricetags';
    
    if (type === PackTypes.ORDER_TOTAL)
        return 'cart';
    
    return 'cash';
};