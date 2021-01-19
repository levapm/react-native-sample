import React from 'react';
import { cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import Slider from "react-native-slider";
import { Alert, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Text, Col, Row, Button, Card, CardItem, Body, Icon, Item, Label, Input, View, ListItem, Left } from "native-base";

import i18n from '../../i18n';
import common from "../../styles/common";
import colors from '../../styles/colors';
import { POINT_SLIDER } from '../constants';
import { awardPoints } from '../services/api';
import PackComponentSummary from '../../pack/components/summary';
import { getFullName } from '../../user/services/helpers';

const containerStyle = [
    common.mx15, common.mt15,
];

const hintTextStyle = {
    color: '#9c9c9c'
};

const initialState = {
    note: '',
    spent: '',
    points: 0,
    packId: null,
    product: null,
    pointStep: 1,
    showHints: true,
    showPacks: true,
};

class PointContainerAward extends React.Component {
    state = cloneDeep(initialState);

    confirmAward () {
        const { user } = this.props;
        const { points, spent, note, packId } = this.state;
        const customerName = getFullName(user.profile);
        const title = i18n.t('point.awardConfirmTitle', { points }),
            message = i18n.t('point.awardConfirmMessage', { points, customerName });

        Alert.alert(title, message, [{
            text: 'Cancel'
        }, {
            text: 'Award Points',
            onPress: async () => {
                try {
                    const pointId = await awardPoints({ amount: parseInt(points), spent, note, packId, ownerId: user._id });
                    
                    if (pointId) {
                        const titleSuccess = i18n.t('point.awardSuccessTitle', { points }),
                            messageSuccess = i18n.t('point.awardSuccessMessage', { points, customerName });

                        this.setPointStep(1);
                        Alert.alert(titleSuccess, messageSuccess, [{ text: 'Close' }]);
                    }
                } catch (err) {
                    Alert.alert("Error!", err.message, [{text: 'Close'}]);
                }
            }
        }]);
    };

    confirmAwardPack (pack) {
        this.setState({ points: pack.points, pointStep: 2, packId: pack._id });
    };

    setPointStep = (pointStep) => {
        if (pointStep === 1)
            return this.setState(initialState);

        this.setState({ pointStep });
    };

    getHeaderText () {
        const { pointStep } = this.state;
        const texts = {
            1: 'Award Points',
            2: 'Add Details',
        };

        return texts[pointStep];
    };

    renderActions () {
        const { pointStep, points, showPacks } = this.state;

        return (
            <>
            <Button
                small
                success
                transparent
                disabled={points < 1}
                onPress={() => pointStep === 2 ? this.confirmAward() : this.setPointStep(2)}
            >
                <Icon name="checkmark-circle-outline" />
            </Button>

            {pointStep === 1 && (
                <Button
                    small
                    transparent
                    onPress={() => this.setState({ showPacks: !showPacks })}
                >
                  <Icon name={showPacks ? 'speedometer' : 'cube'} />
                </Button>
            )}

            { pointStep > 1 && (
                <Button
                    small
                    transparent
                    disabled={points < 1}
                    onPress={() => this.setPointStep(1)}
                >
                    <Icon name="close-circle" />
                </Button>
            ) }
            </>
        );
    };

    renderPacks() {
        return (
            <View>
                <ScrollView horizontal={true} style={[common.px15, common.py10]}>
                    {this.props.packs.map(pack => (
                        <View
                            style={{ width: 280, marginRight: 10 }}
                            key={pack._id}
                        >
                            <PackComponentSummary
                                onAward={() => this.confirmAwardPack(pack)}
                                showAwardButton={true}
                                pack={pack}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    renderSlider() {
        const { points } = this.state;

        return (
            <CardItem>
                <Row style={[common.px5]}>
                    <Col>
                        <Slider
                            value={points}
                            step={POINT_SLIDER.STEP}
                            thumbStyle={[common.bgPrimary]}
                            minimumValue={POINT_SLIDER.MIN}
                            maximumValue={POINT_SLIDER.MAX}
                            minimumTrackTintColor={colors.primary}
                            onValueChange={points => this.setState({ points })}
                        />
                    </Col>
                </Row>
            </CardItem>
        );
    };

    renderDetails() {
        const { product, packId } = this.state;
        const { navigate } = this.props.navigation;

        return (
            <CardItem>
                <Row>
                    <Col>
                        {!packId && (
                            <ListItem 
                                button 
                                noIndent 
                                style={common.pl0}
                                onPress={() => navigate("UserPageProductSearch", {
                                    selectedProduct: null,
                                    handleProductSelect: (product) => {
                                        if (!!product) {
                                            this.setState({product})
                                        }
                                    }
                                })}
                            >
                                <Left>
                                    <Text>Product</Text>
                                    {!!product && (
                                        <Body><Text>{product.name}</Text></Body>
                                    )}
                                </Left>
                            </ListItem>
                        )}

                        <Item inlineLabel>
                            <Label>Note</Label>
                            <Input 
                                value={this.state.note}
                                onChangeText={(note) => this.setState({ note })}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>How much did the user spend?</Label>
                            <Input 
                                value={this.state.spent}
                                keyboardType="number-pad"
                                onChangeText={(spent) => this.setState({ spent })}
                            />
                        </Item>
                    </Col>
                </Row>
            </CardItem>
        );
    };

    renderBody() {
        switch (this.state.pointStep) {
            case 1:
                if (this.state.showPacks)
                    return this.renderPacks();
                else    
                    return this.renderSlider();    
            case 2:
                return this.renderDetails();
            default:
                return null;
        }
    };

    renderHints() {
        if (this.state.pointStep === 1) {
            return (
                <>
                    <Text style={[hintTextStyle, common.pb10]}>
                        Use the slider to set the points you want to award the customer.
                    </Text>
                    <Text style={[hintTextStyle]}>
                        Confirm button on the top right corner will let you add more details before awarding the points.
                    </Text>
                </>
            );
        }

        if (this.state.pointStep === 2) {
            return (
                <>
                    <Text style={[hintTextStyle, common.pb10]}>
                        Make sure you add the product if the points are for a particular product.
                    </Text>
                    <Text style={[hintTextStyle]}>
                        If the points are for a total amount of purchase, mention how much the user spent to get those points.
                    </Text>
                </>
            );
        }

        return null;
    };

    render() {
        const { user } = this.props,
            { points, showHints } = this.state;

        return (
            <Row style={containerStyle}>
                <Col>
                    <Card style={{ borderColor: '#FFFFFF' }}>
                        <CardItem header bordered>
                            <Row>
                                <Col>
                                    <Text style={[common.fs20]}>
                                        { this.getHeaderText() }
                                    </Text>
                                </Col>
                                
                                <Col style={common.alignCenter}>
                                    <Text style={[common.fs20]}>{parseInt(points)} / 100</Text>
                                </Col>

                                <Col style={[common.flexReverse]}>
                                    {this.renderActions()}
                                </Col>
                            </Row>
                        </CardItem>

                        {this.renderBody()}

                        { showHints && (
                            <CardItem style={[common.pt15]}>
                                <Body>
                                    { this.renderHints() }
                                </Body>
                            </CardItem>
                        ) }

                        <CardItem 
                            footer 
                            button 
                            onPress={() => this.setState({ showHints: !showHints })}
                        >
                            <Text>{showHints ? `Hide Hints` : `Show Hints`}</Text>
                        </CardItem>
                    </Card>
                </Col>
            </Row>
        );
    };
};

PointContainerAward.propTypes = {
    user: PropTypes.object.isRequired,
    packs: PropTypes.array.isRequired,
    packsReady: PropTypes.bool.isRequired,
};

export default withNavigation(PointContainerAward);