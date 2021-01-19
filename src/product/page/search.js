import React from "react";
import { View } from 'react-native';
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Text, Col, Row, Grid, Button, Icon, Header, Title, Left, Right, Body } from "native-base";

import i18n from "../../i18n";
import common from "../../styles/common";

import ProductContainerList from '../container/list';
import ProductContainerDetail from "../container/detail";
import ProductComponentNoSelection from "../component/no-selection";

class ProductPageSearch extends React.Component {
    state = {
        viewingProduct: null
    };

    selectProduct = () => {
        const { viewingProduct } = this.state;
        const { navigation } = this.props;
        const { handleProductSelect, returnTo } = navigation.state.params;
        handleProductSelect(viewingProduct);
        if (returnTo)
            navigation.goBack(returnTo);
        else 
            navigation.goBack();
    };

    closePage = () => {
        this.props.navigation.goBack();
    };

    componentDidMount() {
        const { selectedProduct } = this.props.navigation.state.params;

        if (selectedProduct)
            this.setState({viewingProduct: selectedProduct})
    };

    render() {
        const { viewingProduct } = this.state;

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={this.closePage}>
                            <Icon name="arrow-back" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>{i18n.t('product.search.header')}</Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.selectProduct}>
                            <Icon name="checkmark" />
                        </Button>
                    </Right>
                </Header>
                <Grid>
                    <Row>
                        <Col>
                            <Content style={common.bgLighter}>
                                <ProductContainerList
                                    selected={viewingProduct}
                                    onSelect={(prod) => this.setState({ viewingProduct: prod })}
                                />
                            </Content>
                        </Col>
                        <Col>
                            <Content>
                                {!!viewingProduct ? (
                                    <ProductContainerDetail 
                                        product={viewingProduct}
                                    />
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
    const user = Meteor.user();

    if (!user) {
        return props;
    }

    return {
        user, ...props
    };
})(ProductPageSearch);