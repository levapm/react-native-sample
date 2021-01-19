import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Text, Col, Row, Grid, Button, Icon } from "native-base";

import i18n from "../../i18n";
import common from "../../styles/common";
import ProductContainerList from '../container/list';
import ProductComponentDetail from '../container/detail';
import PrimaryHeader from "../../shared/component/primary-header";
import ProductComponentNoSelection from '../component/no-selection';

class ProductPageHome extends React.Component {
    state = {
        selectedProduct: null,
    };

    handleClose = () => {
        if (!this.state.selectedProduct) {
            this.props.navigation.goBack(null);
        } else {
            this.selectProduct(null);
        }
    };

    selectProduct = (selectedProduct) => {
        this.setState({selectedProduct});
    };

    editProduct = (product) => {
        this.props.navigation.navigate('ProductPageEdit', { product });
    };

    render() {
        const { selectedProduct } = this.state;

        return (
            <Container style={common.avoidStatusBar}>
                <Grid>
                    <Row>
                        <Col>
                            <Content style={common.bgLighter}>
                                <PrimaryHeader
                                    icon="cart"
                                    text="Products"
                                >
                                    <Button
                                        light
                                        small
                                        transparent
                                        onPress={this.handleClose}
                                    >
                                        <Icon name={ !selectedProduct ? "arrow-back" : "close-circle" } />
                                    </Button>
                                    <Button
                                        light
                                        small
                                        transparent
                                        onPress={() => this.props.navigation.navigate('ProductPageExtra')}
                                    >
                                        <Text>{ i18n.t('productExtra.listButton') }</Text>
                                    </Button>
                                </PrimaryHeader>

                                <ProductContainerList 
                                    onSelect={this.selectProduct} 
                                    selected={selectedProduct}                         
                                    onEdit={this.editProduct}                          
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content>
                                {selectedProduct ? (
                                    <ProductComponentDetail product={selectedProduct}/>
                                ) : (
                                    <ProductComponentNoSelection />
                                )}
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
})(ProductPageHome);