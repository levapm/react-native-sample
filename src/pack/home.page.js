import React from 'react';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Header, Left, Body, Right, Title, Grid, Row, Col, Button, Icon, Text } from 'native-base';

import i18n from '../i18n';
import common from '../styles/common';

import PackContainerList from './containers/list';
import PackContainerDetail from './containers/detail';

class PackPageHome extends React.Component {
    state = { selected: null };

    selectPack = (selected) => {
        this.setState({ selected });
    };

    render() {
        const { user, returnTo, navigation } = this.props,
            { selected } = this.state;

        return (
            <Container style={[!user && common.avoidStatusBar]}>
                {!!user && (
                    <Header>
                        <Left>
                            <Button onPress={() => returnTo ? navigation.navigate(returnTo) : navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>{i18n.t('pack.home.pageTitle')}</Title>
                        </Body>
                        <Right>
                            <Button onPress={() => navigation.navigate('PackPageCreate')}>
                                <Text>{i18n.t('pack.home.createText')}</Text>
                            </Button>
                        </Right>
                    </Header>
                )}
                <Grid>
                    <Row>
                        <Col size={2} style={common.bgLighter}>
                            <Content style={common.px10}>
                                <PackContainerList
                                    onSelect={this.selectPack}
                                    showChangeButton={true}
                                    
                                />
                            </Content>
                        </Col>
                        <Col size={3}>
                            <Content>
                                {selected && <PackContainerDetail pack={selected} />}
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
})(PackPageHome);