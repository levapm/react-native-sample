import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Text, Col, Row, Grid, Card, CardItem, Spinner, Icon, Header, Left, Body, Title, Button, Right, Content, List } from "native-base";

import i18n from "../i18n";
import common from "../styles/common";
import { logout } from "../auth/services/api";
import { SettingPages } from "./services/pages";

import SettingComponentPageList from "./components/page-list";

class SettingPageHome extends React.Component {    
    state = {
        currentPage: SettingPages[0],
    };

    selectPage = (currentPage) => this.setState({ currentPage });

    renderHeader = () => (
        <Header>
            <Left>
                <Button onPress={() => this.props.navigation.goBack()}>
                    <Icon name="arrow-back"></Icon>
                </Button>
            </Left>
            <Body>
                <Title>
                    <Text style={common.textWhite}>
                        {i18n.t('setting.pageTitle')}
                    </Text>
                </Title>
            </Body>
            <Right>
                <Button onPress={() => logout(() => this.props.navigation.navigate('AuthStack'))}>
                    <Icon name="log-out"></Icon>
                </Button>
            </Right>
        </Header>
    );

    renderPage = () => {
        const { currentPage } = this.state;
        const Comp = currentPage.container;

        return <Comp />;
    };

    render() {
        const { user, navigation } = this.props;

        if (!user)
            return (<Spinner />);

        return (
            <Container>
                {this.renderHeader()}

                <Grid>
                    <Row>
                        <Col size={1}>
                            <Content>
                                <SettingComponentPageList 
                                    onSelect={this.selectPage}
                                    selected={this.state.currentPage}
                                />
                            </Content>
                        </Col>
                        <Col size={2}>
                            <Content style={[common.bgLighter]}>
                                {this.renderPage()}
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    };
};

export default withTracker(props => {
    return {...props, user: Meteor.user()};
})(SettingPageHome);