import React from 'react';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Header, Left, Body, Right, Title, Grid, Row, Col, } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';
import OrderContainerList from '../containers/list';
import OrderContainerDetail from '../containers/detail';
import { resetUnseenOrderCount } from '../services/state';

class OrderPageHome extends React.Component {
    state = {selected: null};

    selectOrder = (selected) => {
        this.setState({ selected });
    };

    componentDidMount() {
        setTimeout(resetUnseenOrderCount, 2*1000);
    };

    render() {
        const { user } = this.props,
            { selected } = this.state;

        return (
            <Container style={[!user && common.avoidStatusBar]}>
                {!!user && (
                    <Header>
                        <Left />
                        <Body>
                            <Title>{i18n.t('order.history.pageTitle')}</Title>
                        </Body>
                        <Right />
                    </Header>
                )}
                <Grid>
                    <Row>
                        <Col size={2} style={common.bgLighter}>
                            <Content style={common.px5}>
                                <OrderContainerList
                                    onSelect={this.selectOrder}
                                />
                            </Content>
                        </Col>
                        <Col size={3}>
                            <Content>
                                { selected && (
                                    <OrderContainerDetail 
                                        order={selected} 
                                        navigation={this.props.navigation} 
                                    />
                                ) }
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    };
};

export default withTracker(props => {
    return { ...props, user: Meteor.user() };
})(OrderPageHome);