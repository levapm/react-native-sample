import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Col, Row, Grid } from "native-base";

import common from "../styles/common";

import PackContainerCreator from './containers/creator';
import PackComponentSummary from "./components/summary";

class PackPageEdit extends React.Component {
    state = {
        packPreview: {},
    };

    componentDidMount() {
        this.updatePreview(this.props.navigation.state.params.pack);
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
                                    pack={navigation.state.params.pack}
                                    onComplete={() => navigation.goBack()}
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content style={common.px15}>
                                <PackComponentSummary
                                    pack={packPreview}
                                />
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
})(PackPageEdit);