import React from 'react';
import { withNavigation } from 'react-navigation';
import { Icon, Grid, Row, Col, Text } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';

const UserComponentNoCheckedInSelection = ({ navigation }) => (
    <Grid style={[common.ml15, common.fullHeightWithHeader]}>
        <Row size={1}></Row>
        <Row size={1}>
            <Col style={common.alignCenter}>
                <Icon name="contacts" />
                <Text style={[common.py5, common.pr15, common.textCenter]}>
                    {i18n.t('user.checkedIn.noSelection')}
                </Text>
            </Col>
        </Row>
        <Row size={1}></Row>
    </Grid>
);

export default withNavigation(UserComponentNoCheckedInSelection);