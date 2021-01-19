import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Col, Row, Grid, Text } from "native-base";

import i18n from "../i18n";
import common from "../styles/common";

import PackContainerCreator from './containers/creator';
import PackComponentSummary from "./components/summary";

class PackPageCreate extends React.Component {
    state = {
        packPreview: {},
    };

    updatePreview = (packPreview) => {
        this.setState({ packPreview });
    };

    render() {
        const { packPreview } = this.state,
            { navigation } = this.props;

        return (
            <Container style={common.avoidStatusBar}>
                <Grid>
                    <Row>
                        <Col>
                            <Content style={[common.bgPrimary]}>
                                <PackContainerCreator 
                                    onChange={this.updatePreview} 
                                    onComplete={() => navigation.goBack()}
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content style={common.px15}>
                                <PackComponentSummary
                                    pack={packPreview}
                                />
                                <Text note style={[common.py10, common.px5]}>
                                    {i18n.t('pack.creator.previewTitle')}
                                </Text>
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
};

export default withTracker((props) => {

    return {
        user: Meteor.user(),
        ...props,
    };
})(PackPageCreate);