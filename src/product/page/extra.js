import React from "react";
import { isEmpty } from 'lodash';
import { Container, Content, Col, Row, Grid, Button, Icon } from "native-base";

import common from "../../styles/common";
import ProductContainerExtraList from '../container/extra-list';
import PrimaryHeader from "../../shared/component/primary-header";
import ProductContainerExtraCreator from "../container/extra-creator";

class ProductPageExtra extends React.Component {
    state = {
        selected: {},
    };

    handleClose = () => {
        if (!isEmpty(this.state.selected)) {
            this.setState({ selected: {} });
        } else {
            this.props.navigation.goBack();
        }
    };

    render() {
        const { selected } = this.state;

        return (
            <Container style={common.avoidStatusBar}>
                <Grid>
                    <Row>
                        <Col>
                            <Content style={common.bgLighter}>
                                <PrimaryHeader
                                    icon="cart"
                                    text="Product Extras"
                                >
                                    <Button
                                        light
                                        small
                                        transparent
                                        onPress={this.handleClose}
                                    >
                                        <Icon name={isEmpty(selected) ? "arrow-back" : "close-circle"} />
                                    </Button>
                                </PrimaryHeader>
                                <ProductContainerExtraList
                                    selectedIds={!isEmpty(selected) ? [selected._id] : []}
                                    onPress={(extra) => this.setState({ selected: extra })}
                                />
                            </Content>
                        </Col>

                        <Col>
                            <Content>
                                <ProductContainerExtraCreator
                                    extra={selected}
                                    key={selected._id}
                                />
                            </Content>
                        </Col>
                    </Row>
                </Grid>
            </Container>
        );
    }
};

export default ProductPageExtra;