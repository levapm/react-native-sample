import React from 'react';
import { withTracker } from '@foysalit/react-native-meteor';
import { Card, CardItem, Text, CheckBox, Body, Left, Col, Row, Button, Icon } from 'native-base';

import { OrderStatesEnum } from '../constants';
import OrderStatus from '../components/status';
import { getStatusColor } from '../services/helpers';
import { getStatusFilter, removeStatusFilter, addStatusFilter } from '../services/state';
import common from '../../styles/common';

class OrderContainerFilters extends React.Component {
    render () {
        const { status, onHide } = this.props;

        return (
            <Card>
                <CardItem header>
                    <Row>
                        <Col style={common.verticalCenter}>
                            <Text>Filter Orders</Text>
                        </Col>

                        {!!onHide && (
                            <Col style={common.flexReverse}>
                                <Button 
                                    small 
                                    transparent 
                                    onPress={onHide}
                                >
                                    <Icon name="close-circle" />
                                </Button>
                            </Col>
                        )}
                    </Row>
                </CardItem>

                {Object.values(OrderStatesEnum).map(s => (
                    <CardItem key={s}>
                        <Left>
                            <CheckBox
                                color={getStatusColor(s).color}
                                checked={status.indexOf(s) >= 0}
                                onPress={() => status.indexOf(s) >= 0 ? removeStatusFilter(s) : addStatusFilter(s)} 
                            />
                            <Body style={common.pl10}>
                                <OrderStatus order={{ status: s }} />
                            </Body>
                        </Left>
                    </CardItem>
                ))}
            </Card>
        );
    };
};

export default withTracker(props => {
    return { 
        ...props, 
        status: getStatusFilter(),
    };
})(OrderContainerFilters);