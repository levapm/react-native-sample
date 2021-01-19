import { omit } from 'lodash';
import { Alert } from "react-native";
import Meteor from '@foysalit/react-native-meteor';

import { apiCall } from '../../shared/services/utils';

export const saveProduct = async (product) => {
    try {
        const pictures = product.pictures.filter(p => !p._id);

        // if a new product, make sure at least one picture is being attached with it
        if (!product._id && pictures.length < 1) {
            Alert.alert("Picture Missing", "Please upload at least one picture for the product.");
            return null;
        }

        const user = Meteor.user();
        product.storeId = user.profile.storeId;

        const methodName = (product._id) ? 'product.update' : 'product.insert';
        const productId = await apiCall(methodName, [omit(product, 'pictures')]);

        if (productId) {
            // console.log(pictures);
            for (const pic of pictures) {
                if (!pic._id) {
                    await apiCall('image.insert', ['product', product._id || productId, pic.uri]);
                    console.log('uploaded pic');
                }
            }

            return productId;
        }

        return null;
    } catch (err) {
        Alert.alert('Error adding product', err.message, [{ text: 'Close' }]);
    }
};

export const removeProduct = (product) => {
    Alert.alert(
        `Remove ${product.name}?`, 
        "Removing product is irreversible action. Make sure you are not removing a product that has been ordered before.",
        [
            {text: 'Keep It', style: 'cancel'}, 
            {text: 'Remove It', onPress: async () => {
                try {
                    await apiCall('product.remove', [product._id]);
                    Alert.alert('Product Removed', `${product.name} has been removed from your store`, [{ text: 'Close' }]);
                } catch (err) {
                    Alert.alert('Error removing product', err.message, [{ text: 'Close' }]);
                }
            }
        }]
    );
};