import React from "react";
import { cloneDeep } from 'lodash';
import Modal from "react-native-modal";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Text, Col, Row, Grid, Button, Icon } from "native-base";

import common from "../../styles/common";
import { addItemToBasket } from '../services/basket';

import ProductAddExtra from "../components/add-extra";
import ProductContainerList from '../../product/container/list';
import PrimaryHeader from "../../shared/component/primary-header";
import ProductContainerDetail from '../../product/container/detail';
import ProductComponentNoSelection from '../../product/component/no-selection';
import { findProductExtrasForProduct } from "../../product/services/data";

const emptyState = {
    queuedQty: {},
    queuedTotal: 0,
    showExtra: false,
};

class OrderPageCreate extends React.Component {
    state = {
        selectedProduct: null,
        ...cloneDeep(emptyState)
    };

    enqueue = (variation) => {
        this.setState((state) => {
            let { queuedQty, queuedTotal } = state;

            if (queuedQty[variation.name]) {
                queuedQty[variation.name].qty += 1;
            } else {
                queuedQty[variation.name] = { name: variation.name, price: variation.price, qty: 1 };
            }

            queuedTotal += variation.price;
            queuedTotal = Number(parseFloat(queuedTotal).toFixed(2));

            return { queuedQty, queuedTotal };
        });
    };

    dequeue = (variation) => {
        this.setState((state) => {
            let { queuedQty, queuedTotal } = state;

            if (queuedQty[variation.name].qty < 2) {
                delete queuedQty[variation.name];
            } else {
                queuedQty[variation.name].qty -= 1;
            }

            queuedTotal -= variation.price;
            queuedTotal = Number(parseFloat(queuedTotal).toFixed(2));
            return { queuedQty, queuedTotal };
        });
    };

    addToBasket = (extras = []) => {
        const { selectedProduct, queuedQty, queuedTotal } = this.state;
        addItemToBasket(selectedProduct, queuedQty, queuedTotal, extras);
        this.setState(() => cloneDeep(emptyState));
    };
    
    showExtras = () => this.setState({ showExtra: true });
    hideExtras = () => this.setState({ showExtra: false });

    handleExtraComplete = (extraItems) => {
        if (extraItems.queuedTotal <= 0) {
            return this.addToBasket([]);
        }

        this.setState((state) => {
            let { queuedTotal } = state;

            queuedTotal += extraItems.queuedTotal;
            return { queuedTotal: Number(parseFloat(queuedTotal).toFixed(2)) };
        }, () => this.addToBasket(Object.values(extraItems.queuedQty)));
    };

    getVariationKey = (variety) => {
        const { queuedQty } = this.state;
        const key = `${variety.name}_${variety.price}_${queuedQty[variety.name] ? queuedQty[variety.name].qty : 0}`;
        return key;
    };

    selectProduct = (selectedProduct) => {
        this.setState({selectedProduct, ...cloneDeep(emptyState)});
    };

    render() {
        const { selectedProduct, queuedQty, queuedTotal, showExtra } = this.state,
            extras = selectedProduct ? findProductExtrasForProduct(selectedProduct) : [],
            handleBasketPress = () => extras.length > 0 ? this.showExtras() : this.addToBasket([]);

        return (
            <Container style={common.avoidStatusBar}>
                <Modal
                    isVisible={showExtra}
                    useNativeDriver={true}
                    swipeDirection={'down'}
                    onSwipeComplete={this.hideExtras}
                    onBackdropPress={this.hideExtras}
                    onBackButtonPress={this.hideExtras}
                    hideModalContentWhileAnimating={true}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                >
                    <ProductAddExtra
                        extras={extras}
                        variations={queuedQty}
                        onComplete={this.handleExtraComplete}
                    />
                </Modal>

                <Grid>
                    <Row>
                        <Col>
                            <Content style={common.bgLighter}>
                                <PrimaryHeader
                                    icon="cart"
                                    text="Products"
                                >
                                    <Button
                                        light
                                        small
                                        transparent
                                        onPress={() => this.props.navigation.goBack(null)}
                                    >
                                        <Icon name="close-circle" />
                                    </Button>
                                    {!!selectedProduct && (
                                        <Button
                                            light
                                            small
                                            transparent
                                            onPress={() => this.selectProduct(null)}
                                        >
                                            <Text>Clear Selected</Text>
                                        </Button>
                                    )}
                                </PrimaryHeader>

                                <ProductContainerList 
                                    onSelect={this.selectProduct} 
                                    selected={selectedProduct}                          
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content>
                                {selectedProduct ? (
                                    <>
                                        <PrimaryHeader>
                                            <Button
                                                small
                                                light
                                                iconLeft
                                                transparent
                                                onPress={handleBasketPress}
                                                disabled={queuedTotal <= 0}
                                                style={[common.mr10, { marginBottom: 3 }]}
                                            >
                                                <Icon name="checkmark-circle" />
                                                {queuedTotal > 0 && <Text>${queuedTotal}</Text>}
                                            </Button>

                                            <Button
                                                small
                                                light
                                                transparent
                                                style={[common.mr10]}
                                                onPress={() => this.props.navigation.navigate('UserPageOrderBasket', this.props.navigation.state.params)}
                                            >
                                                <Icon name="basket" />
                                            </Button>
                                        </PrimaryHeader>
                                        <ProductContainerDetail 
                                            product={selectedProduct}
                                            cartOption={{
                                                queuedQty,
                                                enqueue: this.enqueue,
                                                dequeue: this.dequeue,
                                                variationKeyGetter: this.getVariationKey
                                            }}
                                        />
                                    </>
                                ) : (
                                    <ProductComponentNoSelection />
                                )}
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
};

export default withTracker((props) => {
    let user = Meteor.user(),
        extraSub = Meteor.subscribe('productExtra.list').ready();

    return {
        ...props, extraSub, user,
    };
})(OrderPageCreate);