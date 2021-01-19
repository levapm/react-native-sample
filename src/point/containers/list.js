import React from 'react';
import { format } from 'date-fns';
import { View } from 'react-native';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Text, Body, List, ListItem, Left, Spinner, Grid, Row, Col } from "native-base";

import common from '../../styles/common';
import { findPoints } from '../services/data';
import { findUser } from '../../user/services/api';
import { getPointFilterEndDate, getPointFilterStartDate, getPointFilterOwner, } from '../services/state';
import { getFullName } from '../../user/services/helpers';
import {findOrder} from "../../order/services/data";

class PointContainerList extends React.Component {
    render () {
        const { pointsReady, points } = this.props;

        if (!pointsReady)
            return (<Spinner />);

        return (
            <List>
                {points.map((point => (
                    <ListItem avatar key={point._id}>
                        <Left>
                            <View
                                style={[common.alignCenter, common.verticalCenter, common.bgPrimary, common.br45, { width: 45, height: 45 }]}>
                                <Text style={[ common.fs20, common.fontBold, common.textWhite, common.ml0 ]}>
                                    {getFullName(point.owner.profile)[0]}
                                </Text>
                            </View>
                        </Left>
                        <Body>
                            <Grid>
                                <Row>
                                    <Col size={3}>
                                        <Text>{format(point.awardedAt, 'DD MMM, YY')}</Text>
                                        {!!point.presenter && (<Text note>Awarded by {getFullName(point.presenter.profile)}</Text>)}
                                        {!!point.note && (<Text note>{point.note}</Text>)}
                                        {!!point.order && (<Text>#{point.order.uid}</Text>)}
                                    </Col>
                                    <Col size={1} style={[common.flexReverse, common.alignCenter]}>
                                        <Text style={[point.amount > 0 ? common.textSuccess : common.textDanger]}>
                                            {point.amount}
                                        </Text>
                                    </Col>
                                </Row>
                            </Grid>
                        </Body>
                    </ListItem>
                )))}
            </List>
        );
    }
};

export default withTracker(props => {
    const endDate = getPointFilterEndDate();
    const startDate = getPointFilterStartDate();
    const owner = getPointFilterOwner();

    const filters = {};

    if (endDate) {
        filters.awardedAt = {$lte: endDate};
    }

    if (startDate) {
        if (!filters.awardedAt) filters.awardedAt = {};
        filters.awardedAt.$gte = startDate;
    }

    if (owner) {
        filters.ownerId = owner._id;
    }

    const pointsSub = Meteor.subscribe('point.list', filters),
        pointsReady = pointsSub.ready(),
        points = findPoints().map(point => {
            const owner = findUser(point.ownerId);
            const presenter = findUser(point.awardedBy);
            const order = findOrder({_id: point.orderId});

            return { ...point, owner, presenter, order };
        });
    
    return {
        ...props,
        pointsReady, points,
    };
})(PointContainerList);