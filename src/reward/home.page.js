import React from 'react';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Header, Left, Body, Right, Title, Grid, Row, Col, Button, Icon, Text } from 'native-base';

import i18n from '../i18n';
import common from '../styles/common';

import RewardContainerList from './containers/list';
import RewardContainerDetail from './containers/detail';

class RewardPageHome extends React.Component {
    state = { selected: null };

    selectReward = (selected) => {
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
                            <Title>{i18n.t('reward.home.pageTitle')}</Title>
                        </Body>
                        <Right>
                            <Button onPress={() => navigation.navigate('RewardPageCreate')}>
                                <Text>{i18n.t('reward.home.createText')}</Text>
                            </Button>
                        </Right>
                    </Header>
                )}
                <Grid>
                    <Row>
                        <Col size={2} style={common.bgLighter}>
                            <Content style={common.px10}>
                                <RewardContainerList
                                    onSelect={this.selectReward}
                                    showChangeButton={true}
                                    
                                />
                            </Content>
                        </Col>
                        <Col size={3}>
                            <Content>
                                {selected && <RewardContainerDetail reward={selected} />}
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
})(RewardPageHome);