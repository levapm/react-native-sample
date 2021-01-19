import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from 'lodash';
import { Text, View, List, Left, ListItem, Right, Grid, Row, Col, Badge, Icon, Button, Body } from 'native-base';

import i18n from "../../i18n";
import common from "../../styles/common";
import ProductPictureSlider from "../component/picture-slider";
import { findProductPictures } from "../../image/services/api";

const getProductPictures = (product) => {
    let pics = [];

    if (product._id) {
        pics = findProductPictures(product._id);
    }

    if (product.pictures) {
        product.pictures.map(pic => pics.push(pic));
    }

    return pics;
};

const OrderableVariation = ({variety, queuedQty, enqueue, dequeue}) => (
    <ListItem style={common.ml0}>
        <Body style={common.ml0}>
            <Text>
                {!!queuedQty[variety.name] && `${queuedQty[variety.name].qty} x `}{ variety.name }
            </Text>
        </Body>

        {!!queuedQty[variety.name] && (
            <Right>
                <Button 
                    small 
                    transparent
                    onPress={() => dequeue(variety)}>
                    <Icon name="remove" />
                </Button>
            </Right>
        )}

        <Right>
            <Text style={[ common.textBackground ]}>
                ${ parseFloat(variety.price).toFixed(2) }
            </Text>
        </Right>
        <Right>
            <Button 
                small 
                transparent
                onPress={() => enqueue(variety)}>
                <Icon name="add" />
            </Button>
        </Right>
    </ListItem>
);

const NonOrderableVariation = ({ variety }) => (
    <ListItem style={common.ml0}>
        <Body style={common.ml0}>
            <Text>
                {variety.name}
            </Text>
            <Text note>
                {variety.description}
            </Text>
        </Body>

        <Right>
            <Text style={[common.textBackground]}>
                ${variety.price}
            </Text>
        </Right>
    </ListItem>
);

const ExtraItem = ({extra}) => (
    <ListItem style={common.ml0}>
        <Body style={[common.ml0]}>
            <Text>{extra.name}</Text>
            <Text note>{extra.description}</Text>
        </Body>
        <Right>
            <Text>${extra.price}</Text>
        </Right>
    </ListItem>
);

const ProductComponentPreview = ({ product, cartOption=false, onPictureDelete }) => {
    const productPics = getProductPictures(product);
    const hasPics = (productPics && productPics.length > 0);

    return (
        <>
        {hasPics && (
            <ProductPictureSlider 
                pictures={productPics}
                onDelete={onPictureDelete} 
            />
        )}
        <View style={[common.px15, common.pt15]}>
            <Grid>
                <Row>
                    <Col>
                        <Text style={[common.pb15, common.fontBold]}>
                            {product.name || i18n.t('product.preview.noName')}
                        </Text>
                    </Col>
                    <Col style={[common.flexReverse]}>
                        <Badge primary>
                            <Text style={[common.textWhite, common.fs10]}>
                                ${product.price || i18n.t('product.preview.noPrice')}
                            </Text>
                        </Badge>
                    </Col>
                </Row>
            </Grid>
            <Text style={[common.pb15, common.fs15]}>
                {product.description || i18n.t('product.preview.noDescription')}
            </Text>

            {product.variations && product.variations.length > 0 && (
                <>
                <View style={[common.px0]}>
                    <Text style={[common.fontBold, common.pb10]}>
                        Variations
                    </Text>
                </View>

                <List>
                    {product.variations.map((variety, i) => !isEmpty(cartOption) ? (
                        <OrderableVariation 
                            key={cartOption.variationKeyGetter(variety)}
                            variety={variety}
                            {...cartOption} 
                        />
                    ) : (
                        <NonOrderableVariation 
                            key={i}
                            variety={variety}
                        />
                    ))}
                    {!!product.salesTax && (
                        <ListItem noIndent style={common.pl10}>
                            <Left>
                                <Text note>
                                    Tax (included in price)
                                </Text>
                            </Left>
                            <Right>
                                <Text>
                                    {product.salesTax}%
                                </Text>
                            </Right>
                            <Right />
                        </ListItem>
                    )}
                </List>
                </>
            )}

            {product.extras && product.extras.length > 0 && (
                <>
                <View style={[common.pt15]}>
                    <Text style={[common.fontBold, common.pb10]}>
                        Extras
                    </Text>
                </View>

                <List>      
                    {product.extras.map(ex => (        
                        <ExtraItem 
                            extra={ex}
                            key={ex._id}
                        />
                    ))}  
                </List>
                </>
            )}
        </View>
        </>
    );
};

ProductComponentPreview.propTypes = {
    product: PropTypes.object,
    cartOption: PropTypes.object,
    onPictureDelete: PropTypes.func,
    variationKeyGetter: PropTypes.func,
};

export default ProductComponentPreview;