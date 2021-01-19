import { Mongo } from '@foysalit/react-native-meteor';

export const ProductExtras = new Mongo.Collection('productExtras');
export const Products = new Mongo.Collection('products');

export const findProducts = (filters) => {
    return Products.find(filters);
};

export const findProductExtrasForProduct = (product = {}) => {
    return ProductExtras.find({ _id: { $in: product.extraIds || [] } });
};

export const findProductExtras = () => {
    return ProductExtras.find({});
};

export const saveProductExtra = (extra={}, done) => {
    if (extra._id) {
        ProductExtras.update(extra._id, {$set: extra}, done);
    } else {
        ProductExtras.insert(extra, done);
    }
};