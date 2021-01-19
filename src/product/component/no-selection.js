import React from 'react';
import { withNavigation } from 'react-navigation';
import { Icon, Grid, Row, Col, Text, Button, View } from 'native-base';

import i18n from '../../i18n';
import common from '../../styles/common';

const ProductComponentNoSelection = ({ navigation }) => (
    <Grid style={[common.ml15, common.fullHeightWithHeaderAndFooter]}>
        <Row size={1}></Row>
        <Row size={1}>
            <Col style={common.alignCenter}>
                <Icon name="pricetags" />
                <Text style={[common.py5]}>
                    {i18n.t('product.search.noSelection')}
                </Text>
                <View>
                    <Button 
                        primary
                        onPress={() => navigation.navigate('ProductPageCreate')}
                    >
                        <Icon name="add-circle" />
                        <Text>{i18n.t('product.createButtonText')}</Text>
                    </Button>
                </View>
            </Col>
        </Row>
        <Row size={1}></Row>
    </Grid>
);

export default withNavigation(ProductComponentNoSelection);