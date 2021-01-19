import React from 'react';
import { Container, Content, Right, Left, Body, Header, Icon, Button, Title, Grid, Row, Col } from "native-base";

import common from '../styles/common';
import PointContainerList from './containers/list';
import PointContainerFilters from './containers/filters';

class PointPageHistory extends React.Component {
    render () {
        const { navigation } = this.props,
            { returnTo } = navigation.state.params;

        return (
            <Container>
                <Header primary>
                    <Left>
                        <Button onPress={() => returnTo ? navigation.navigate(returnTo) : navigation.goBack()}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Point History</Title>
                    </Body>
                    <Right/>
                </Header>
                <Grid>
                    <Row>
                        <Col size={2} style={[common.px10, common.bgLighter]}>
                            <PointContainerFilters />
                        </Col>
                        <Col size={3}>
                            <Content>
                                <PointContainerList />
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    };
};

export default PointPageHistory;