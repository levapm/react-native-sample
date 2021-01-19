import React from 'react';
import { get } from 'lodash';
import { SwipeListView } from "react-native-swipe-list-view";
import { Alert, TouchableHighlight, StyleSheet } from 'react-native';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Header, Left, Body, Text, Icon, Content, Right, Button, View, ListItem, Title, Grid, Row, Col } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { placeOrder } from '../services/api';
import { findUser } from '../../user/services/api';
import { findStores } from '../../store/services/data';
import { OrderDeliveryMethods, OrderPaymentMethods } from '../constants';
import {
    emptyBasket,
    getItemsFromBasket,
    removeItemFromBasket,
    computeBasketTotal,
    actuallyEmptyBasket
} from '../services/basket';

import PaymentPicker from '../components/payment-picker';
import DeliveryPicker from '../components/delivery-picker';
import { findDeliveryAddressesOfUser } from '../services/data';
import {formatAmount} from "../../shared/services/utils";

const styles = StyleSheet.create({
    row: {
        ...common.bgLight,
        ...common.py10,
    },
    rowActions: {
        ...common.bgLighter,
        ...common.flexReverse,
        flex: 1,
    },
    deleteButton: {
        width: 50,
        ...common.bgDanger,
        ...common.alignCenter,
        ...common.verticalCenter,
    }
});

class OrderPageBasket extends React.Component {
    state = {
        deliveryMethod: OrderDeliveryMethods.STORE_PICKUP,
        paymentMethod: OrderPaymentMethods.CASH,
        deliveryAddress: null,
    };

    item = ({ item, section }) => {
        return (
            <Grid style={styles.row}>
                <Row>
                    <Col style={common.flexRow}>
                        <Text style={common.pl15}>{item.qty} x {item.name}</Text>
                    </Col>
                    <Col style={common.flexReverse}>
                        <Text style={common.pr10}>${formatAmount(item.price)}</Text>
                    </Col>
                </Row>

                {section.extras && section.extras.length > 0 && section.extras.map(extra => (
                    <Row key={`${extra.name}_${section.itemId}`}>
                        <Col style={common.flexRow}>
                            <Text note style={common.pl15}>{extra.qty} x {extra.name}</Text>
                        </Col>
                        <Col style={common.flexReverse}>
                            <Text style={common.pr10} note>
                                ${formatAmount(extra.price)}
                            </Text>
                        </Col>
                    </Row>
                ))}

                {!!section.product && !!section.product.salesTax && (
                    <Row>
                        <Col style={common.flexRow}>
                            <Text note style={common.pl15}>
                                Tax (included in price)
                            </Text>
                        </Col>
                        <Col style={common.flexReverse}>
                            <Text style={common.pr10} note>
                                {section.product.salesTax}%
                            </Text>
                        </Col>
                    </Row>
                )}
            </Grid>
        );
    };

    divider = ({ section: { product, total } }) => (
        <ListItem itemDivider>
            <Left>
                <Text style={[common.textCapital, common.fontBold]}>
                    {product.name}
                </Text>
            </Left>

            <Right>
                <Text>${ formatAmount(total) }</Text>
            </Right>
        </ListItem>
    );

    renderEmptySection = () => (
        <View style={[common.fullHeightWithHeader, common.verticalCenter]}>
            <View style={[common.alignCenter]}>
                <Icon name="basket" style={[common.fs50]} />
                <Text style={[common.textCenter, common.fs25]}>
                    {i18n.t('order.basket.emptyMessage')}
                </Text>
            </View>
        </View>
    );

    place = () => {
        Alert.alert(i18n.t('order.place.confirmTitle'), i18n.t('order.place.confirmMessage'), [{
            text: 'Cancel'
        }, {
            text: 'Place Order', onPress: async () => {
                try {
                    const customerId = get(this.props, 'navigation.state.params.customerId');
                    await placeOrder({ customerId, ...this.state });
                    actuallyEmptyBasket();
                    this.props.navigation.pop(2);
                } catch (err) {
                    Alert.alert(i18n.t('order.place.errorTitle'), err.message);
                }
            }
        }]);
    };

    render () {
        const { navigation, items, customer, orderTotal, store, deliveryAddresses } = this.props,
            products = Object.values(items).map(item => ({
                ...item, data: Object.values(item.variations)
            }));

        const { paymentMethod, deliveryMethod, deliveryAddress } = this.state;
        const insufficientBalance = customer.balance < orderTotal * 100;
        const cantOrder = products.length < 1
            || (paymentMethod === OrderPaymentMethods.ACCOUNT_BALANCE && insufficientBalance)
            || (deliveryMethod === OrderDeliveryMethods.HOME_DELIVERY && !deliveryAddress);

        return (
            <Container>
                <Header noShadow>
                    <Left>
                        <Button transparent onPress={() => navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{ i18n.t('order.basket.pageTitle') } | ${formatAmount(orderTotal)}</Title>
                    </Body>
                    <Right>
                        <Button 
                            transparent 
                            onPress={emptyBasket}
                            disabled={products.length < 1}
                        >
                            <Icon name="close-circle" />
                        </Button>

                        <Button 
                            transparent
                            disabled={cantOrder} 
                            onPress={this.place}
                        >
                            <Icon name="checkmark-circle" />
                        </Button>
                    </Right>
                </Header>

                <Content>
                    {products.length > 0 ? (
                        <Grid>
                            <Row>
                                <Col size={3}>
                                    <SwipeListView
                                        useSectionList
                                        rightOpenValue={-50}
                                        sections={products}
                                        renderItem={this.item}
                                        renderSectionHeader={this.divider}
                                        keyExtractor={item => item.name}
                                        renderHiddenItem={({ section, item }) => (
                                            <View style={styles.rowActions}>
                                                <TouchableHighlight
                                                    style={styles.deleteButton}
                                                    onPress={() =>
                                                        removeItemFromBasket(
                                                            section.itemId,
                                                            item,
                                                        )
                                                    }>
                                                    <Icon
                                                        name="close-circle"
                                                        style={common.textWhite}
                                                    />
                                                </TouchableHighlight>
                                            </View>
                                        )}
                                    />
                                </Col>
                                <Col size={2} style={[common.bgLighter, common.fullHeightWithHeader]}>
                                    <DeliveryPicker
                                        store={store}
                                        deliveryMethod={deliveryMethod}
                                        onChange={(deliveryMethod) => this.setState({ deliveryMethod })}

                                        deliveryAddress={deliveryAddress}
                                        deliveryAddresses={deliveryAddresses}
                                        onAddressChange={(addr) => this.setState({ deliveryAddress: addr })}
                                    />

                                    <PaymentPicker
                                        paymentMethod={paymentMethod}
                                        needsRecharge={insufficientBalance}
                                        onChange={(paymentMethod) => this.setState({ paymentMethod })}
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    ) : this.renderEmptySection()}
                </Content>
            </Container>
        );
    };
};

export default withTracker(props => {
    const items = getItemsFromBasket() || {},
        user = Meteor.user(),
        store = findStores({_id: user.profile.storeId})[0],
        customer = findUser(props.navigation.state.params.customerId),
        deliveryAddresses = findDeliveryAddressesOfUser(customer._id),
        orderTotal = computeBasketTotal();

    return {
        deliveryAddresses, store, orderTotal, customer, items, ...props,
    };
})(OrderPageBasket);