import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Col, Row, Grid } from "native-base";

import common from "../styles/common";
import { removeImage } from "../image/services/api";

import RewardContainerCreator from './containers/creator';
import RewardComponentSummary from "./components/summary";

class RewardPageEdit extends React.Component {
    state = {
        rewardPreview: {},
    };

    componentDidMount() {
        this.updatePreview(this.props.navigation.state.params.reward);
    };

    updatePreview = (rewardPreview) => {
        this.setState({ rewardPreview });
    };

    handlePictureDelete = async (pic) => {
        const { rewardPreview } = this.state;

        if (pic._id) {
            await removeImage(pic._id);
        } else {
            rewardPreview.pictures = rewardPreview.pictures.filter(p => p.uri !== pic.uri);
            this.updatePreview(rewardPreview);
        }
    };

    render() {
        const { rewardPreview } = this.state,
            { navigation } = this.props;

        return (
            <Container style={common.avoidStatusBar}>
                <Grid>
                    <Row>
                        <Col>
                            <Content style={[common.bgPrimary]}>
                                <RewardContainerCreator 
                                    onChange={this.updatePreview} 
                                    onComplete={() => navigation.goBack()}
                                    reward={navigation.state.params.reward}
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content style={common.px15}>
                                <RewardComponentSummary
                                    reward={rewardPreview}
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
})(RewardPageEdit);