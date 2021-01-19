import React from 'react';
import { pick } from 'lodash';
import { Dimensions } from "react-native";
import { List, ListItem, Icon, Button, Right, Text, Content, Left, View, Grid, Row, Col, Body } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { computeExtraMultiplier } from '../../order/services/basket';

const { height: winHeight } = Dimensions.get('window');

class ProductAddExtra extends React.Component {
    state = {
        queuedQty: {},
        queuedTotal: 0,
    };

    enqueue = (extra) => {
        this.setState((state, props) => {
            let { queuedQty, queuedTotal } = state;

            if (queuedQty[extra._id]) {
                queuedQty[extra._id].qty += 1;
            } else {
                queuedQty[extra._id] = { ...pick(extra, ['name', 'price', 'description']), qty: 1 };
            }

            const multiplier = computeExtraMultiplier(props.variations);
            queuedTotal += (extra.price * multiplier);
            queuedTotal = Number(parseFloat(queuedTotal).toFixed(2));
            return { queuedQty, queuedTotal };
        });
    };

    dequeue = (extra) => {
        this.setState((state, props) => {
            let { queuedQty, queuedTotal } = state;

            if (queuedQty[extra._id].qty < 2) {
                delete queuedQty[extra._id];
            } else {
                queuedQty[extra._id].qty -= 1;
            }

            const multiplier = computeExtraMultiplier(props.variations);
            queuedTotal -= (extra.price * multiplier);
            queuedTotal = Number(parseFloat(queuedTotal).toFixed(2));
            return { queuedQty, queuedTotal };
        });
    };

    render() {
        const { queuedQty, queuedTotal } = this.state,
            { variations, extras } = this.props;

        return (
            <View style={[common.bgLight, { height: (winHeight / 2 + 30) }]}>
                <Grid>
                    <Row style={[common.bgPrimary, { height: 50, flex: 0 }]}>
                        <Col size={3}>
                            <Text style={[common.fs15, common.pl15, common.py5, common.textWhite]}>
                                {i18n.t('productExtra.addHeader')}
                            </Text>
                            <Text style={[common.fs10, common.pl15, common.pb5, common.textWhite]}>
                                {i18n.t('productExtra.addSubHeader', { itemCount: Object.keys(variations).length })}
                            </Text>
                        </Col>
                        <Col size={2} style={[common.flexReverse, common.py10, common.pl10]}>
                            <Button
                                small
                                light
                                bordered
                                onPress={() => this.props.onComplete(this.state)}
                            >
                                <Icon name='checkmark' />
                                <Text>${parseFloat(queuedTotal).toFixed(2)}</Text>
                            </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Content>
                            <List>
                                {extras.map(extra => (
                                    <ListItem
                                        noIndent
                                        key={extra._id}
                                        style={[common.pl10]}
                                    >
                                        <Left>
                                            <Text>
                                                {!!queuedQty[extra._id] && `${queuedQty[extra._id].qty} x `}{extra.name}
                                            </Text>
                                        </Left>

                                        <Right>
                                            {!!queuedQty[extra._id] && (
                                                <Button
                                                    small
                                                    transparent
                                                    onPress={() => this.dequeue(extra)}>
                                                    <Icon name="remove" />
                                                </Button>
                                            )}
                                        </Right>

                                        <Right>
                                            <Text style={[common.textBackground]}>
                                                ${parseFloat(extra.price).toFixed(2)}
                                            </Text>
                                        </Right>

                                        <Right>
                                            <Button
                                                small
                                                transparent
                                                onPress={() => this.enqueue(extra)}>
                                                <Icon name="add" />
                                            </Button>
                                        </Right>
                                    </ListItem>
                                ))}
                            </List>
                        </Content>
                    </Row>
                </Grid>
            </View>
        );
    };
};

export default ProductAddExtra;