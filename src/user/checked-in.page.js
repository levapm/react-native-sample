import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Text, Col, Row, Grid } from "native-base";

import i18n from "../i18n";
import common from "../styles/common";
import UserContainerCheckedInList from './container/checked-in-list';
import UserContainerCheckedInSingle from './container/checked-in-single';
import UserComponentNoCheckedInSelection from './components/no-checked-in-selection';

class UserPageCheckedIn extends React.Component {
    state = {
        selectedUser: null,
    };

    selectUser = (selectedUser) => {
        this.setState({selectedUser});
    };

    render() {
        const { selectedUser } = this.state;

        return (
            <Container style={common.avoidStatusBar}>
                <Grid>
                    <Row>
                        <Col size={1}>
                            <Content>
                                <UserContainerCheckedInList 
                                    selected={selectedUser}
                                    onSelect={this.selectUser}                          
                                />
                            </Content>
                        </Col>

                        <Col size={2} style={common.bgLighter}>
                            {selectedUser ? (
                                <UserContainerCheckedInSingle 
                                    userId={selectedUser._id}
                                    navigation={this.props.navigation} 
                                    onCheckOut={() => this.selectUser(null)}
                                />
                            ) : (
                                <UserComponentNoCheckedInSelection />
                            )}
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
})(UserPageCheckedIn);