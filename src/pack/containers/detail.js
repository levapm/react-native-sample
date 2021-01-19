import React from 'react';
import { format } from 'date-fns';
import { withNavigation } from 'react-navigation';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Grid, Row, Col, Text, Button, Icon, Card, Spinner } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import { removePack } from '../services/api';
import { findUser } from '../../user/services/api';
import { findPoints } from '../../point/services/data';
import { findProducts } from '../../product/services/data';

import PrimaryHeader from '../../shared/component/primary-header';
import UserComponentSmallPreview from '../../user/components/small-preview';

class PackContainerDetail extends React.Component {
    render () {
        const { pack, pointsReady, points, navigation } = this.props;

        return (
            <Grid>
                <Row style={[common.px10, common.py15]}>
                    <Col size={2}>
                        <Text style={common.fontBold}>{pack.title}</Text>
                        <Text style={common.textPrimary}>{pack.points} pts</Text>
                        {!pack.isAvailable && (
                            <Text style={common.textPrimary}>Deactivated</Text>
                        )}
                    </Col>
                    <Col size={1} style={common.flexReverse}>
                        <Button
                            small
                            transparent
                            onPress={() => removePack(pack)}
                            >
                            <Icon name="trash" />
                        </Button>
                        <Button 
                            small
                            transparent
                            onPress={() => navigation.navigate("PackPageEdit", { pack })}
                        >
                            <Icon name="create" />
                        </Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <PrimaryHeader
                            icon="contacts"
                            text={i18n.t('pack.detail.customerHeader')}
                        />
                    </Col>
                </Row>
                <Row style={[common.px10, common.pt10]}>
                    <Col>
                        {pointsReady ? ( points.length > 0 ? points.map(point => (
                            <Card key={point._id}>
                                <UserComponentSmallPreview
                                    inCard={true} 
                                    user={point.owner} 
                                />
                            </Card>
                        )) : (
                            <Text>{i18n.t('pack.detail.noCustomers')}</Text>
                        )) : (
                            <Spinner />
                        )}
                    </Col>
                </Row>
            </Grid>
        );
    };
};

export default withTracker(props => {
    let filters = {packId: props.pack._id};

    let pointsSub = Meteor.subscribe('point.list', filters),
        points = pointsSub.ready() ? findPoints(filters) : [];

    if (props.pack.productId) {
        props.pack.product = findProducts({_id: props.pack.productId})[0];
    }

    if (points) {
        points = points.map(p => {
            p.owner = findUser(p.ownerId);
            return p;
        });
    }
    
    return { ...props, pointsReady: pointsSub.ready(), points };
})(withNavigation(PackContainerDetail));