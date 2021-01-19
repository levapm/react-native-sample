import React from "react";
import Meteor, { withTracker } from '@foysalit/react-native-meteor';
import { Container, Content, Col, Row, Grid } from "native-base";

import common from "../../styles/common";
import { removeImage } from "../../image/services/api";

import ProductContainerDetail from '../container/detail';
import ProductContainerCreator from '../container/creator';

class ProductPageEdit extends React.Component {
    state = {
        productPreview: {},
    };

    componentDidMount () {
        this.updatePreview(this.props.product);
    };

    updatePreview = (productPreview) => {
        this.setState({ productPreview });
    };

    handlePictureDelete = async (pic) => {
        const { productPreview } = this.state;

        if (pic._id) {
            await removeImage(pic._id);
        } else {
            productPreview.pictures = productPreview.pictures.filter(p => p.uri !== pic.uri);
            this.updatePreview(productPreview);
        }
    };

    render() {
        const { productPreview } = this.state,
            { navigation, product } = this.props;

        return (
            <Container style={common.avoidStatusBar}>
                <Grid>
                    <Row>
                        <Col>
                            <Content style={[common.bgPrimary]}>
                                <ProductContainerCreator 
                                    product={product}
                                    onChange={this.updatePreview} 
                                    onComplete={() => navigation.goBack()}
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content>
                                <ProductContainerDetail 
                                    product={productPreview}
                                    onPictureDelete={this.handlePictureDelete} 
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
        product: props.navigation.state.params.product,
        user: Meteor.user(),
        ...props,
    };
})(ProductPageEdit);