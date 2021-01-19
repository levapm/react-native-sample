import React from 'react';
import PropTypes from 'prop-types';
import { omit, clone } from 'lodash';
import { addDays, format } from 'date-fns';
import { TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Form, Item, Label, Icon, Input, Button, Text, Spinner, Grid, Row, Col, Radio } from 'native-base';

import colors from '../../styles/colors';
import common from '../../styles/common';
import coloredForm from '../../styles/colored-form';

import i18n from '../../i18n';
import { RewardTypes } from '../constants';
import { saveReward } from '../services/api';
import RewardSchema from '../services/schema';
import { takePhoto } from '../../image/services/helpers';

import PrimaryHeader from '../../shared/component/primary-header';
import RewardComponentTypePicker from '../components/type-picker';

class RewardContainerCreator extends React.Component {
    validator = RewardSchema.omit('storeId').newContext();

    state = {
        inputs: {
            picture: null,
            isActive: true,
            requiredPoints: 0,
            type: RewardTypes.CASHBACK,
            expiresAt: addDays(new Date(), 30),
        },
        loading: false,
        focusedField: null,
        showDatePicker: false,
    };

    componentDidMount() {
        if (this.props.reward)
            this.setState({ inputs: {...this.state.inputs, ...this.props.reward} });
    };

    _showDatePicker = () => this.setState({ showDatePicker: true });

    _hideDatePicker = () => this.setState({ showDatePicker: false });

    _handleDatePicked = (date) => {
        this.handleInput('expiresAt', date);
        this._hideDatePicker();
    };
    placeholderText(fieldName) {
        const placeholders = {
            name: i18n.t('reward.creator.namePlaceholder'),
        };

        if (this.state.focusedField === fieldName)
            return "";

        return placeholders[fieldName];
    };

    handleInput(field, text) {
        const { inputs } = this.state;

        if (['requiredPoints', 'value'].indexOf(field) >= 0)
            inputs[field] = parseInt(text);
        else 
            inputs[field] = text;

        this.setState({ inputs });
        this.props.onChange(inputs);
    };

    save = async () => {
        const { inputs } = this.state;
        // these keys exist when editing an existing prod from db
        const cleanedInputs = this.validator.clean(omit(inputs, ['picture', '_id', '_version', 'product']));
        this.validator.validate(cleanedInputs);

        if (!this.validator.isValid()) {
            return this.setState({ errors: this.validator.validationErrors() });
        }

        this.setState({ loading: true });
        
        const rewardId = await saveReward(inputs);
        this.setState({ loading: false });

        if (rewardId)
            this.props.onComplete();
    };

    showImagePicker = async () => {
        const uri = await takePhoto(true);

        if (!uri)
            return;

        this.handleInput('picture', { uri });
    };
    
    showProductPicker = () => {
        const { inputs } = this.state;

        this.props.navigation.navigate('ProductPageSearch', {
            selectedProduct: inputs.product,
            handleProductSelect: (prod) => {
                if (!!prod) {
                    this.handleInput('product', prod);
                    this.handleInput('productId', prod._id);
                } else {
                    this.handleInput('product', null);
                    this.handleInput('productId', null);
                }
            },
        });
    };

    renderFieldError(field) {
        const error = this.validator.keyErrorMessage(field);

        if (!error)
            return null;

        return (
            <Text style={[common.textWhite, common.pl5, common.fontBold]}>
                {this.validator.keyErrorMessage(field)}
            </Text>
        )
    };

    render() {
        const { inputs, loading } = this.state;

        return (
            <>
            <PrimaryHeader 
                icon="gift"
                text="Add New Reward"
            >

                { loading && <Spinner size="small" color={colors.light} style={{height: 45}} /> }
                
                <Button
                    light
                    transparent
                    disabled={loading}
                    onPress={this.props.onComplete}
                >
                    <Icon name="close-circle"/>
                </Button>
                <Button
                    light
                    transparent
                    disabled={loading}
                    onPress={this.save}
                >
                    <Icon name="checkmark-circle-outline"/>
                </Button>
                <Button
                    light
                    transparent
                    disabled={loading}
                    onPress={this.showImagePicker}
                >
                    <Icon name="camera"/>
                </Button>
                
            </PrimaryHeader>

            <Form style={[common.px10]}>
                <Label style={[coloredForm.label]}>Title</Label>
                <Item 
                    rounded
                    style={[coloredForm.item]}
                >
                    <Input
                        name="title"
                        value={inputs.title}
                        returnKeyType="next"
                        style={[coloredForm.input]}
                        ref={ref => (this._title = ref)}
                        placeholderTextColor={colors.fadedLight}
                        placeholder={this.placeholderText("title")}
                        onChangeText={this.handleInput.bind(this, 'title')}
                        onBlur={() => this.setState({ focusedField: null })}
                        onFocus={() => this.setState({ focusedField: 'title' })} />
                </Item>
                {this.renderFieldError('title')}

                <Grid>
                    <Row>
                        <Col>
                            <Label style={[coloredForm.label]}>Valid Until</Label>
                            <Item
                                rounded
                                style={coloredForm.item}
                            >
                                <Input
                                    disabled
                                    style={[coloredForm.input]}
                                    onTouchStart={this._showDatePicker}
                                    value={format(inputs.expiresAt, 'DD MMM, YYYY')}
                                />
                            </Item>

                            <DateTimePicker
                                date={inputs.expiresAt}
                                minumumDate={new Date()}
                                onCancel={this._hideDatePicker}
                                onConfirm={this._handleDatePicked}
                                isVisible={this.state.showDatePicker}
                            />
                            {this.renderFieldError('expiresAt')}
                        </Col>
                        <Col style={[common.pl15]}>
                            <Label style={[coloredForm.label]}>Required Points</Label>
                            <Item
                                rounded
                                style={[coloredForm.item]}
                            >
                                <Input
                                    name="requiredPoints"
                                    returnKeyType="next"
                                    keyboardType="number-pad"
                                    style={[coloredForm.input]}
                                    value={`${inputs.requiredPoints || ''}`}
                                    ref={ref => (this._requiredPoints = ref)}
                                    placeholderTextColor={colors.fadedLight}
                                    placeholder={this.placeholderText("requiredPoints")}
                                    onBlur={() => this.setState({ focusedField: null })}
                                    onChangeText={this.handleInput.bind(this, 'requiredPoints')}
                                    onFocus={() => this.setState({ focusedField: 'requiredPoints' })}
                                />
                            </Item>
                            {this.renderFieldError('requiredPoints')}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Label style={[coloredForm.label]}>Set the reward type</Label>
                            <RewardComponentTypePicker 
                                reward={inputs}
                                onSelect={this.handleInput.bind(this, 'type')}
                            />
                        </Col>
                    </Row>

                    {inputs.type === RewardTypes.CASHBACK && (
                        <Row>
                            <Col>
                                <Label style={[coloredForm.label]}>Cashback Amount</Label>
                                <Item
                                    rounded
                                    style={[coloredForm.item]}
                                >
                                    <Input
                                        name="value"
                                        returnKeyType="next"
                                        keyboardType="number-pad"
                                        style={[coloredForm.input]}
                                        value={`${inputs.value || ''}`}
                                        ref={ref => (this._value = ref)}
                                        placeholderTextColor={colors.fadedLight}
                                        placeholder={this.placeholderText("value")}
                                        onBlur={() => this.setState({ focusedField: null })}
                                        onChangeText={this.handleInput.bind(this, 'value')}
                                        onFocus={() => this.setState({ focusedField: 'value' })}
                                    />
                                </Item>
                                {this.renderFieldError('value')}
                            </Col>
                            <Col></Col>
                        </Row>
                    )}

                    {inputs.type === RewardTypes.PERCENTAGE && (
                        <Row>
                            <Col>
                                <Label style={[coloredForm.label]}>Sale Percentage</Label>
                                <Item
                                    rounded
                                    style={[coloredForm.item]}
                                >
                                    <Input
                                        name="value"
                                        returnKeyType="next"
                                        keyboardType="number-pad"
                                        style={[coloredForm.input]}
                                        value={`${inputs.value || ''}`}
                                        ref={ref => (this._value = ref)}
                                        placeholderTextColor={colors.fadedLight}
                                        placeholder={this.placeholderText("value")}
                                        onBlur={() => this.setState({ focusedField: null })}
                                        onChangeText={this.handleInput.bind(this, 'value')}
                                        onFocus={() => this.setState({ focusedField: 'value' })}
                                    />
                                </Item>
                                {this.renderFieldError('value')}
                            </Col>
                            <Col></Col>
                        </Row>
                    )}

                    {inputs.type === RewardTypes.PRODUCT && (
                        <Row>
                            <Col>
                                <Label style={[coloredForm.label]}>Select Product</Label>
                                <TouchableOpacity 
                                    onPress={this.showProductPicker}
                                    style={[common.pl5, common.pb15]}
                                >   
                                    {!inputs.product ? (
                                        <Text style={common.textWhite}>
                                            No Product Selected
                                        </Text>
                                    ) : (
                                        <>
                                            <Text style={[common.textWhite, common.fontBold]}>
                                                {inputs.product.name}
                                            </Text>
                                            <Text style={common.textWhite}>
                                                {inputs.product.category}
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                {this.renderFieldError('value')}
                            </Col>

                            <Col>
                                <Label style={[coloredForm.label]}>How many items?</Label>
                                <Item
                                    rounded
                                    style={[coloredForm.item]}
                                >
                                    <Input
                                        name="value"
                                        value={`${inputs.value || ''}`}
                                        returnKeyType="next"
                                        style={[coloredForm.input]}
                                        ref={ref => (this._value = ref)}
                                        placeholderTextColor={colors.fadedLight}
                                        placeholder={this.placeholderText("value")}
                                        onChangeText={this.handleInput.bind(this, 'value')}
                                        onBlur={() => this.setState({ focusedField: null })}
                                        onFocus={() => this.setState({ focusedField: 'value' })} />
                                </Item>
                                {this.renderFieldError('value')}
                            </Col>
                        </Row>
                    )}

                    <Row 
                        style={[common.pl5, common.pr15, common.pt10]}
                        onPress={() => this.handleInput('isActive', !inputs.isActive)}
                    >
                        <Col size={2}>
                            <Text style={common.textWhite}>
                                {i18n.t('reward.creator.activeText')}
                            </Text>
                        </Col>
                        <Col size={1} style={common.flexReverse}>
                            <Radio
                                color={colors.fadedLight}
                                selected={inputs.isActive}
                                selectedColor={colors.light}
                            />
                        </Col>
                    </Row>
                </Grid>
            </Form>
            </>
        );
    }
};

RewardContainerCreator.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    reward: PropTypes.object,
};

export default withNavigation(RewardContainerCreator);