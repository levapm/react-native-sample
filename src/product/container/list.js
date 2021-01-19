import React from 'react';
import { groupBy } from 'lodash';
import { PropTypes } from "prop-types";
import { SectionList } from "react-native";
import Meteor, {withTracker} from '@foysalit/react-native-meteor';
import { ListItem, Left, Body, Text, Icon, Right, Button, Spinner, Thumbnail, View, Item, Input } from 'native-base';

import common from '../../styles/common';
import { findProducts, removeProduct, findProductExtras, findProductExtrasForProduct } from '../services/data';
import { findProductPictures } from '../../image/services/api';

import ProductComponentEmpty from '../component/empty';

class ProductContainerList extends React.Component {
    state = { searchQuery: '', searchFocused: false, };

    toggleSearchFocus = () => {
        this.setState({ searchFocused: !this.state.searchFocused });
    };
    
    item = ({ item, index, section }) => {
        let productPic = findProductPictures(item._id);

        if (productPic.length > 0) {
            productPic = productPic[0].uri;
        } else {
            productPic = 'http://lorempixel.com/200/200/food';
        }
        
        return (
            <ListItem
                avatar
                button
                noBorder
                last={section.data.length - 1 === index}
                onPress={() => this.props.onSelect(item)}
                selected={this.props.selected && item._id === this.props.selected._id} 
            >
                <Left>
                    <Thumbnail circular source={{ uri: productPic }} />
                </Left>
                <Body>
                    <Text>{item.name}</Text>
                    <Text note>{ this.getNoteText(item) }</Text>
                    { item.description && <Text note numberOfLines={1}>{item.description}</Text> }
                </Body>
                {!!this.props.onEdit && (
                    <Right>
                        <Button transparent onPress={() => this.props.onEdit(item)}>
                            <Icon name="create" />
                        </Button>
                    </Right>
                )}
                <Right>
                    <Button transparent danger onPress={() => removeProduct(item)}>
                        <Icon name="trash" />
                    </Button>
                </Right>
            </ListItem>
        );
    };

    getNoteText (product) {
        let text = '$'+ product.price;

        if (product.variations && product.variations.length > 0) {
            text += ` | ${product.variations.length} Variations`;
        }

        return text;
    };

    divider = ({ section: { category } }) => (
        <ListItem itemDivider>
            <Text style={[common.textCapital, common.fontBold, common.fs15]}>
                {category}
            </Text>
        </ListItem>
    );

    render () {
        const { searchQuery, searchFocused } = this.state;
        const { productsReady } = this.props;
        let { products } = this.props;

        if (searchQuery.length > 1) {
            const q = searchQuery.toLocaleLowerCase();
            products = products.filter(({ name }) => name.toLowerCase().indexOf(q) >= 0);
        }

        const groupedByCategory = groupBy(products, 'category'),
            categorizedProducts = Object.keys(groupedByCategory).map(category => ({
                category,
                data: groupedByCategory[category]
            }));

        return (
            <View>
                <Item style={[common.my10]}>
                    <Input
                        value={searchQuery}
                        placeholder='Type to search...'
                        onFocus={this.toggleSearchFocus}
                        onBlur={this.toggleSearchFocus}
                        onChangeText={(searchQuery) => this.setState({ searchQuery })}
                    />
                    {(!searchFocused && searchQuery.length < 1) && <Icon active name='search' />}
                    {(searchQuery.length > 0) && <Icon active name='close' onPress={() => this.setState({ searchQuery: '' })} />}
                </Item>
                
                {productsReady ? (categorizedProducts.length > 0 ? (
                    <SectionList
                        renderItem={this.item}
                        sections={categorizedProducts}
                        keyExtractor={(item) => item._id}
                        renderSectionHeader={this.divider}
                    />
                ) : (
                    <ProductComponentEmpty />
                )) : (
                    <Spinner />
                )}
            </View>
        );
    };
};

ProductContainerList.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.object,
    onEdit: PropTypes.func,
};

export default withTracker(props => {
    const user = Meteor.user();
    
    if (!user) {
        return props;
    }

    const productsReady = Meteor.subscribe('product.list', user.profile.storeId).ready(),
        productExtrasReady = Meteor.subscribe('productExtra.list').ready();

    let products = productsReady ? findProducts({ storeId: user.profile.storeId }) : [];
    
    if (productExtrasReady) {
        products = products.map(prod => {
            prod.extras = findProductExtrasForProduct(prod);
            return prod; 
        });
    }

    return {
        products, productsReady,
        user, ...props
    };
})(ProductContainerList);