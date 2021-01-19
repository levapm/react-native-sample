import React from 'react';
import { format } from 'date-fns';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { SectionList, TouchableOpacity } from 'react-native';
import { Left, Text, Content, Right, ListItem, Spinner, Grid, Row, Col, View, Button } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import Theme from '../../../native-base-theme/variables/platform';

import OrderContainerActions from './actions';
import OrderComponentStatus from '../components/status';

import { findOrder } from '../services/data';
import { findUser } from '../../user/services/api';
import { formatAmount } from '../../shared/services/utils';
import { findProducts } from '../../product/services/data';
import { OrderStatesEnum, OrderDeliveryMethods } from '../constants';
import { getPaymentMethodColor, showDeliveryAddressInMap } from '../services/helpers';

const borderedRow = { borderBottomColor: Theme.listBorderColor, borderBottomWidth: Theme.borderWidth };

class OrderContainerDetail extends React.Component {
    item = ({ item, index, section }) => {
        const notLastItem = index < (section.data.length - 1);

        return (
            <Grid style={[notLastItem && common.my5, common.py5, common.pr10, notLastItem && borderedRow]}>
                <Row>
                    <Col style={common.flexRow}>
                        <Text style={common.pl15}>{item.qty} x {item.name}</Text>
                    </Col>
                    <Col style={common.flexReverse}>
                        <Text>${formatAmount(item.price)}</Text>
                    </Col>
                </Row>

                {section.extras && section.extras.length > 0 && (
                    <>
                        <Row>
                            <Text note style={common.pl15}>{i18n.t('productExtra.listHeader')}</Text>
                        </Row>
                        {section.extras.map(extra => (
                            <Row key={`${extra.name}_${section.itemId}`}>
                                <Col style={common.flexRow}>
                                    <Text note style={common.pl15}>{extra.qty} x {extra.name}</Text>
                                </Col>
                                <Col style={common.flexReverse}>
                                    <Text note>${formatAmount(extra.price)}</Text>
                                </Col>
                            </Row>
                        ))}
                    </>
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
                <Text>${formatAmount(total)}</Text>
            </Right>
        </ListItem>
    );

    deliveryDetails = ({deliveryMethod, deliveryAddress}) => (
        <>
            <Text style={common.fs15}>
                {i18n.t(`order.deliveryMethods.${deliveryMethod}`)}
            </Text>

            {deliveryMethod === OrderDeliveryMethods.HOME_DELIVERY && (
                <TouchableOpacity onPress={() => showDeliveryAddressInMap(deliveryAddress)}>
                    <Text note>
                        {deliveryAddress.line1}, {deliveryAddress.zip}, {deliveryAddress.city}
                    </Text>
                    {deliveryAddress.line2 && (
                        <Text note>
                            {deliveryAddress.line2}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
        </>
    );

    render() {
        const { orderReady, order, navigation } = this.props;

        return (
            <Content>
                {orderReady && order ? (
                    <Grid >
                        <Row style={[common.pl15, common.pr10, common.pt15, common.pb10]}>
                            <Col>
                                <Text style={[common.fs20]}>
                                    {i18n.t('order.detail.summaryText')} #{order.uid}
                                </Text>

                                <View>
                                    <Text>{format(order.placedAt, 'DD MMM, YY [at] h:mm a')}</Text>
                                </View>

                                {this.deliveryDetails(order)}

                                <View style={[common.flexRow]}>
                                    <OrderComponentStatus order={order} />
                                    {order.status === OrderStatesEnum.REJECTED && (
                                        <Text> | {format(order.rejection.at, 'DD MMM, YY [at] h:mm a')}</Text>
                                    )}
                                    {order.status === OrderStatesEnum.PROCESSING && (
                                        <Text> | ETA {order.processing.eta}</Text>
                                    )}
                                </View>
                                {order.status === OrderStatesEnum.REJECTED && (
                                    <Text note>{ order.rejection.reason }</Text>
                                )}
                            </Col>
                            <Col style={[common.verticalCenter]}>
                                <View style={common.flexReverse}>
                                    <Text style={getPaymentMethodColor(order.paymentMethod)}>
                                        {i18n.t(`order.paymentMethods.${order.paymentMethod}`)}
                                    </Text>
                                </View>
                                <View style={common.flexReverse}>
                                    <Text>${formatAmount(order.total)}</Text>
                                </View>

                                {!!order.tipTotal && order.tipTotal > 0 && (
                                    <View style={common.flexReverse}>
                                        <Text note>{i18n.t('order.tipLabel')} : ${ formatAmount(order.tipTotal) }</Text>
                                    </View>
                                )}

                                <View style={[common.flexReverse, common.pt10]}>
                                    <OrderContainerActions 
                                        order={order}
                                        onRecreate={() => navigation.navigate('UserPageOrderBasket', {
                                            customerId: order.customerId
                                        })} 
                                    />
                                </View>
                            </Col>
                        </Row>

                        {!!order.note && (
                            <Row style={[common.px15, common.py10, common.bgLighter]}>
                                <Col>
                                    <Text note>{i18n.t('order.detail.noteLabel')}</Text>
                                    <Text style={[common.fs15, common.textCapitalized]}>{order.note}</Text>
                                </Col>
                            </Row>
                        )}
                        
                        <Row>
                            <Col>
                                <SectionList
                                    renderItem={this.item}
                                    sections={order.productData}
                                    renderSectionHeader={this.divider}
                                    keyExtractor={(item) => item.name}
                                />
                            </Col>
                        </Row>
                    </Grid>
                ) : (
                    <Spinner />
                )}
            </Content>
        );
    };
};

export default withTracker(props => {
    let { order } = props;
    const filter = { _id: order._id },
        orderReady = Meteor.subscribe('order.list', filter).ready();

    if (orderReady) {
        order = findOrder(filter);

        if (order) {
            order.productData = order.products.map(prod => {
                return { ...prod, data: prod.variations, product: findProducts({ _id: prod._id })[0] };
            });
            
            order.customer = findUser(order.placedBy);
        }
    }

    return {
        ...props, order, orderReady,
    };
})(OrderContainerDetail);