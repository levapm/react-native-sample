import React from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Text, View, CardItem, Spinner, Grid, Row, Col, Card, Item, Input, Icon, Button } from "native-base";

import i18n from '../../i18n';
import common from '../../styles/common';
import { findOrders } from '../services/data';
import { findUser } from '../../user/services/api';
import { getStatusFilter } from '../services/state';

import OrderContainerFilters from './filters';
import OrderComponentEmpty from '../components/empty';
import OrderComponentStatus from '../components/status';
import UserComponentSmallPreview from '../../user/components/small-preview';

class OrderContainerList extends React.Component {
    state = { 
        searchQuery: '', 
        searchFocused: false,

        showFilters: false,
    };

    itemCount (products) {
        let count = 0;
        products.forEach(p => count += p.variations.length);

        return count;
    };

    toggleSearchFocus = () => {
        this.setState({ searchFocused: !this.state.searchFocused });
    };

    render () {
        let { ordersReady, orders } = this.props;
        const { searchQuery, searchFocused, showFilters } = this.state;

        if (searchQuery.length > 1) {
            const q = searchQuery.toLocaleLowerCase();
            orders = orders.filter(({ uid }) => uid.toLowerCase().indexOf(q) >= 0);
        }

        return (
            <View>
                {!showFilters ? (
                    <Grid>
                        <Row>
                            <Col size={5}>
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
                            </Col>
                            <Col size={1} style={[common.alignCenter, common.verticalCenter]}>
                                <Button 
                                    transparent 
                                    onPress={() => this.setState({ showFilters: true })}
                                >
                                    <Icon name="options" />
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                ) : (
                    <OrderContainerFilters onHide={() => this.setState({ showFilters: false })} />
                )}
                
                {
                    !ordersReady ? (<Spinner />) : (orders.length < 1 ? (
                        <OrderComponentEmpty />
                    ) : orders.map((order => (
                        <Card key={order._id} style={[common.mb10]}>
                            <CardItem 
                                header 
                                button
                                bordered 
                                onPress={() => !!this.props.onSelect ? this.props.onSelect(order) : null}
                            >
                                <Grid>
                                    <Row>
                                        <Col>
                                            <Text>Order #{order.uid}</Text>
                                            <Text note style={common.textPrimary}>
                                                {this.itemCount(order.products)} items
                                            </Text>
                                            <Text note>{format(order.placedAt, 'DD MMM, YY [at] h:mm a')}</Text>
                                        </Col>
                                        <Col style={common.verticalCenter}>
                                            <View style={common.flexReverse}>
                                                <Text note>
                                                    {i18n.t(`order.deliveryMethods.${order.deliveryMethod}`)}
                                                </Text>
                                            </View>
                                            <View style={common.flexReverse}>
                                                <OrderComponentStatus order={order} />
                                            </View>
                                            <View style={[common.flexReverse]}>
                                                <Text>${parseFloat(order.total).toFixed(2)}</Text>
                                            </View>
                                        </Col>
                                    </Row>
                                </Grid>
                            </CardItem>
                            {order.customer && (
                                <UserComponentSmallPreview 
                                    inCard={true}
                                    user={order.customer} 
                                />
                            )}
                        </Card>
                    ))))
                }
            </View>
        );
    }
};

OrderContainerList.propTypes = {
    onSelect: PropTypes.func,
};

export default withTracker(props => {
    const filters = {
        status: { $in: getStatusFilter() }
    };

    const ordersSub = Meteor.subscribe('order.list', filters),
        ordersReady = ordersSub.ready(),
        orders = findOrders(filters).map(order => {
            order.customer = findUser(order.customerId);

            return order;
        });
    
    return { ...props, ordersReady, orders, };
})(OrderContainerList);